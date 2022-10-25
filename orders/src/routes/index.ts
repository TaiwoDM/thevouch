import express, { Request, Response } from 'express';
import { requireAuth } from '@gethomes/common';

import { Order } from '../model/order';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('home');

  res.send(orders);
});

export { router as indexOrderRouter };
