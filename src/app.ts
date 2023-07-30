import express, { Response, NextFunction } from "express";
import mongoose from "mongoose";
import errorHandler from "./middlewares/ErrorHandler";
import auth from "./middlewares/Auth";
import { requestLogger, errorLogger } from './middlewares/Logger';
import userRouter from "./routes/users";
import cardRouter from "./routes/cards";
import authRouter from "./routes/auth";
import { RequestUser } from "./types/types";
import NotFoundError from "./errors/NotFound";
import { defaultPort } from "./utils/constants";

const app = express();
const { PORT = defaultPort } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use(express.json());

app.use(requestLogger);
app.use(authRouter)
app.use("/users", auth, userRouter);
app.use("/cards", auth, cardRouter);

app.all("*", (req: RequestUser, res: Response, next: NextFunction) =>
  next(new NotFoundError())
);

app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
