import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(private errors: ValidationError[]) {
    super('Invalid request body'); //for logs only

    // Gets class too work properly when extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    // format of all error resp accross app
    let formattedErrors: { message: string; field?: string }[] = [];

    this.errors.forEach((error) => {
      formattedErrors.push({ message: error.msg, field: error.param });
    });

    return formattedErrors;
  }
}
