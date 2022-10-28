import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validationRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@gethomes/common';

import { Voucher } from '../models/voucher';
import { VoucherUpdatedPublisher } from '../events/publishers/voucher-updated-publisher';
import { natsWrapper } from '../nats_wrapper';

const router = express.Router();

router.put(
  '/api/vouchers/:id',
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
    const voucher = await Voucher.findById(req.params.id);

    if (!voucher) {
      throw new NotFoundError();
    }

    if (voucher.orderId) {
      throw new BadRequestError('Cannot edit a reserved voucher');
    }

    if (voucher.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    voucher.set({
      product: req.body.product,
      description: req.body.description,
      price: req.body.price,
      percentageOff: req.body.percentageOff,
      productPrice: req.body.productPrice,
    });

    await voucher.save();

    new VoucherUpdatedPublisher(natsWrapper.client).publish({
      id: voucher.id,
      product: voucher.product,
      productPrice: voucher.productPrice,
      description: voucher.description,
      percentageOff: voucher.percentageOff,
      price: voucher.price,
      userId: voucher.userId,
      version: voucher.version,
    });

    res.send(voucher);
  }
);

export { router as updateVoucherRouter };
