import express, { Request, Response } from 'express';
// import { NotFoundError } from '@gethomes/common';

import { Home } from '../models/home';

const router = express.Router();

router.get('/api/homes', async (req: Request, res: Response) => {
  const homes = await Home.find({ orderId: undefined });

  res.send(homes);
});

export { router as indexHomeRouter };
