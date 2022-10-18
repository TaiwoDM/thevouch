import express, { Request, Response } from 'express';
import { requireAuth, validationRequest } from '@gethomes/common';
import { body } from 'express-validator';

import { Home } from '../models/home';

const router = express.Router();

router.post(
  '/api/homes',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { description, price, picture } = req.body;

    const home = Home.build({
      description,
      picture,
      price,
      userId: req.currentUser!.id,
    });
    await home.save();

    res.status(201).send(home);
  }
);

export { router as createHomeRouter };
