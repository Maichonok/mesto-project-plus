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
    console.log(err.message);
    res.status(500).send({
      message: "Error",
    });
  }
  next();
};

export default errorHandler;
