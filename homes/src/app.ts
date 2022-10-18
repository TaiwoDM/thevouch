import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@gethomes/common';

import { createHomeRouter } from './routes/new';
import { showHomeRouter } from './routes/show';
import { indexHomeRouter } from './routes/index';
import { updateHomeRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);

app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);

app.use(createHomeRouter);
app.use(showHomeRouter);
app.use(indexHomeRouter);
app.use(updateHomeRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
