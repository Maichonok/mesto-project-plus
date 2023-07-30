import CustomError from "./CustomError";

export default class NotAllowed extends CustomError {
  statusCode = 405;

  message = "";

  constructor(message: string = "") {
    super(message);
    this.message = message || "Not Allowed";
    Object.setPrototypeOf(this, NotAllowed.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}