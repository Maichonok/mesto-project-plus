import CustomError from "./CustomError";

export default class NotFoundError extends CustomError {
  statusCode = 404;

  message = "Not found";

  constructor() {
    super("Not found");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
