import express, { Request, Response } from 'express';
// import { NotFoundError } from '@gethomes/common';

import { Home } from '../models/homes';

const router = express.Router();

router.get('/api/homes', async (req: Request, res: Response) => {
  const homes = await Home.find({});

  res.send(homes);
});

export { router as indexHomeRouter };
