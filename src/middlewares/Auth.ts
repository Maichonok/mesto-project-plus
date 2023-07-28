import { Response, RequestUser, NextFunction } from "express";
import UnauthorizedError from "../errors/UnauthorizedError";
import jwt from "jsonwebtoken";

const auth = (req: RequestUser, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnauthorizedError("Need to authorize"));
  } else {
    const token = authorization.replace("Bearer ", "");
    let payload;
    try {
      payload = jwt.verify(token, "secret");
      req.user = payload;
    } catch (error) {
      next(new UnauthorizedError("Need to authorize"));
      return;
    }
    next();
  }
};

export default auth;
