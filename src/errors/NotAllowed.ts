import CustomError from "./CustomError";

export default class NotAllowed extends CustomError {
  statusCode = 405;

  constructor(message: string = "Not Allowed") {
    super(message);
    Object.setPrototypeOf(this, NotAllowed.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}