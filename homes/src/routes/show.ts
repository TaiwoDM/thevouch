import express, { Request, Response } from 'express';
import { NotFoundError } from '@gethomes/common';

import { Home } from '../models/home';

const router = express.Router();

router.get('/api/homes/:id', async (req: Request, res: Response) => {
  const home = await Home.findById(req.params.id);

  if (!home) {
    throw new NotFoundError();
  }

  res.send(home);
});

export { router as showHomeRouter };
