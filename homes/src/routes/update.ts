import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validationRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@gethomes/common';

import { Home } from '../models/home';
import { HomeUpdatedPublisher } from '../events/publishers/home-updated-publisher';
import { natsWrapper } from '../nats_wrapper';

const router = express.Router();

router.put(
  '/api/homes/:id',
  requireAuth,
  [
    body('product').not().isEmpty().withMessage('product name is required'),
    body('description')
      .not()
      .isEmpty()
      .withMessage('offer description is required'),
    body('percentageOff')
      .isFloat({ gt: 0 })
      .withMessage('Percentage Off is required'),
    body('productPrice')
      .isFloat({ gt: 0 })
      .withMessage('product original price is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const home = await Home.findById(req.params.id);

    if (!home) {
      throw new NotFoundError();
    }

    if (home.orderId) {
      throw new BadRequestError('Cannot edit a reserved Home');
    }

    if (home.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    home.set({
      product: req.body.product,
      description: req.body.description,
      price: req.body.price,
      percentageOff: req.body.percentageOff,
      productPrice: req.body.productPrice,
    });

    await home.save();

    new HomeUpdatedPublisher(natsWrapper.client).publish({
      id: home.id,
      product: home.product,
      productPrice: home.productPrice,
      description: home.description,
      percentageOff: home.percentageOff,
      price: home.price,
      userId: home.userId,
      version: home.version,
    });

    res.send(home);
  }
);

export { router as updateHomeRouter };
