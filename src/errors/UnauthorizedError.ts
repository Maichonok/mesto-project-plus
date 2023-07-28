import CustomError from "./CustomError";

export default class NotAuthorizedError extends CustomError {
  statusCode = 401;

  message = "Not authorized";

  constructor(message: string) {
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}