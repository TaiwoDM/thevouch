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
import { Home } from '../model/home';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats_wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('homeId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('homeId must be provided'),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { homeId } = req.body;

    //// Find the home the user is trying to order in the database
    const home = await Home.findById(homeId);
    if (!home) {
      throw new NotFoundError();
    }

    //// Make sure that this home is not already reserved
    const isReserved = await home.isReserved();
    if (isReserved) {
      throw new BadRequestError('This home is already reserved');
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      home,
    });
    await order.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      home: {
        id: home.id,
        price: home.price,
      },
      version: order.version,
    });

    res.status(201).send({ order });
  }
);

export { router as newOrderRouter };
