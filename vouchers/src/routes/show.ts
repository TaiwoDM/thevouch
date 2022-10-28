import express, { Request, Response } from 'express';
import { NotFoundError } from '@gethomes/common';

import { Voucher } from '../models/voucher';

const router = express.Router();

router.get('/api/vouchers/:id', async (req: Request, res: Response) => {
  const voucher = await Voucher.findById(req.params.id);

  if (!voucher) {
    throw new NotFoundError();
  }

  res.send(voucher);
});

export { router as showVoucherRouter };
