import { FieldValidationError } from "express-validator";
import CustomError from "./CustomError";

export default class RequestValidationError extends CustomError {
  errors: FieldValidationError[];

  statusCode = 400;

  constructor(errors: FieldValidationError[]) {
    super("Invalid request parameters");

    // because we are extending a build in class(Error)
    Object.setPrototypeOf(this, RequestValidationError.prototype);

    this.errors = errors;
  }

  serializeErrors() {
    return this.errors.map((e) => ({
      message: e.msg,
      field: e.path
    }));
  }
}
