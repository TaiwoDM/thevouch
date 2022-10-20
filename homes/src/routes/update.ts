import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validationRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@gethomes/common';

import { Home } from '../models/home';

const router = express.Router();

router.put(
  '/api/homes/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('description').not().isEmpty().withMessage('Description is required'),
    body('picture').not().isEmpty().withMessage('picture is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const home = await Home.findById(req.params.id);

    if (!home) {
      throw new NotFoundError();
    }

    if (home.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    home.set({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      picture: req.body.picture,
    });

    await home.save();

    res.send(home);
  }
);

export { router as updateHomeRouter };
