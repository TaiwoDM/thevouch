import { Request, Response, NextFunction } from 'express';

import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    // format of all error resp accross app
    let errors: { message: string; field?: string }[] = [];

    err.errors.forEach((error) => {
      errors.push({ message: error.msg, field: error.param });
    });

    return res.status(400).send({ errors: errors });
  }

  if (err instanceof DatabaseConnectionError) {
    res.status(500).send({ errors: [{ message: err.reason }] });
  }

  console.error(err);
  res.status(400).send({ message: 'Something went wrong' });
};
