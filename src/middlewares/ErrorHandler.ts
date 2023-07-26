import { Request, Response, NextFunction } from "express";
import CustomError from "../errors/CustomError";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send(err.serializeErrors());
  } else {
    res.status(500).send({
      message: "Произошла ошибка",
    });
  }
  next();
};

export default errorHandler;
