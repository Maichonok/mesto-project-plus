import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UnauthorizedError from "../errors/UnauthorizedError";
import { SessionRequest } from "../types/types";

const auth = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Not authorized"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, "secret");
    req.user = payload;
    return next();
  } catch (error) {
    return next(new UnauthorizedError("Not authorized"));
  }
};

export default auth;
