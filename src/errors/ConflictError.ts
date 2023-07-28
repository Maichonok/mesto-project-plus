import CustomError from "./CustomError";

export default class ConflictError extends CustomError {
  statusCode = 409;

  message = "";

  constructor(message: string) {
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
