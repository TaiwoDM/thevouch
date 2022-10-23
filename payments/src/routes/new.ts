import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validationRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@gethomes/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-event';
import { natsWrapper } from '../nats_wrapper';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validationRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order');
    }

    const charge = await stripe.charges.create({
      source: token,
      currency: 'usd',
      amount: order.price * 100,
    });

    const payment = Payment.build({ orderId, stripeId: charge.id });
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId,
      stripeId: charge.id,
    });

    res.send({ id: payment.id });
  }
);

export { router as createChargeRouter };
