import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@gethomes/common';

import { createVoucherRouter } from './routes/new';
import { showVoucherRouter } from './routes/show';
import { indexVoucherRouter } from './routes/index';
import { updateVoucherRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);

app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUser);

app.use(createVoucherRouter);
app.use(showVoucherRouter);
app.use(indexVoucherRouter);
app.use(updateVoucherRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
// changed k8s contex
