import express, { Request, Response } from 'express';
// import { NotFoundError } from '@gethomes/common';

import { Voucher } from '../models/voucher';

const router = express.Router();

router.get('/api/vouchers', async (req: Request, res: Response) => {
  const vouchers = await Voucher.find({ orderId: undefined });

  res.send(vouchers);
});

export { router as indexVoucherRouter };
