import express, { Request, Response } from 'express';
import { requireAuth, validationRequest } from '@gethomes/common';
import { body } from 'express-validator';

import { Voucher } from '../models/voucher';
import { VoucherCreatedPublisher } from '../events/publishers/voucher-created-publisher';
import { natsWrapper } from '../nats_wrapper';
import { VoucherUpdatedPublisher } from '../events/publishers/voucher-updated-publisher';

const router = express.Router();

router.post(
  '/api/vouchers',
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
    const { product, productPrice, description, price, percentageOff } =
      req.body;

    const voucher = Voucher.build({
      product,
      productPrice,
      description,
      percentageOff,
      price,
      userId: req.currentUser!.id,
      createdAt: new Date(Date.now()),
    });
    await voucher.save();

    new VoucherCreatedPublisher(natsWrapper.client).publish({
      id: voucher.id,
      product: voucher.product,
      productPrice: voucher.productPrice,
      description: voucher.description,
      percentageOff: voucher.percentageOff,
      price: voucher.price,
      userId: voucher.userId,
      version: voucher.version,
    });

    res.status(201).send(voucher);
  }
);

export { router as createVoucherRouter };
