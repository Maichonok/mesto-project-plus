import CustomError from "./CustomError";

export default class ConflictError extends CustomError {
  statusCode = 409;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
