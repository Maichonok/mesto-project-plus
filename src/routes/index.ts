import { Router, Response, NextFunction } from "express";
import { RequestUser } from "../types/types";
import NotFoundError from "../errors/NotFound";
import auth from "./auth";
import cards from "./cards";
import users from "./users";
import provideAuth from "../middlewares/Auth";

const routes = Router();

routes.use(auth);

routes.use("/cards", provideAuth, cards);

routes.use("/users", provideAuth, users);

routes.use("*", (req: RequestUser, res: Response, next: NextFunction) =>
  next(new NotFoundError())
);

export default routes;
