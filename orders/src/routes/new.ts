import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import {
  requireAuth,
  validationRequest,
  NotFoundError,
  BadRequestError,
} from '@gethomes/common';
import { body } from 'express-validator';

import { Order, OrderStatus } from '../model/order';
import { Voucher } from '../model/voucher';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats_wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 10 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('voucherId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('voucher id must be provided'),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { voucherId } = req.body;

    //// Find the voucher the user is trying to order in the database
    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      throw new NotFoundError();
    }

    //// Make sure that this voucher is not already reserved
    const isReserved = await voucher.isReserved();
    if (isReserved) {
      throw new BadRequestError('This voucher is already reserved');
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      voucher,
    });

    await order.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      voucher: {
        id: voucher.id,
        price: voucher.price,
      },
      version: order.version,
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
