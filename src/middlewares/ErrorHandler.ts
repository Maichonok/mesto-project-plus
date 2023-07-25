import { Request, Response } from "express";
import CustomError from "../errors/CustomError";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  return res.status(500).send({
    errors: [
      {
        message: err.message,
      },
    ],
  });
};

export default errorHandler;
