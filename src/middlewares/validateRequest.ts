import { Request, Response, NextFunction } from "express";
import { validationResult, FieldValidationError } from "express-validator";
import RequestValidationError from "../errors/RequestValidationError";

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
    .array()
    .map((e) => e as FieldValidationError);

  if (errors.length) {
    throw new RequestValidationError(errors);
  }

  next();
};

export default validateRequest;
