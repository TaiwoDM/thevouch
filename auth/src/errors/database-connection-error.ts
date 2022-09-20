export class DatabaseConnectionError extends Error {
  reason = 'Error connecting to db';

  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
