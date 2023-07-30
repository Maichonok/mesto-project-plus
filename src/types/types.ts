import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface RequestUser extends Request {
  user?:{
    _id: string
  }
}

export interface SessionRequest extends Request {
  user?: string | JwtPayload;
}
