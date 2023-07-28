import express, { Response, NextFunction } from "express";
import mongoose from "mongoose";
import errorHandler from "./middlewares/ErrorHandler";
import userRouter from "./routes/users";
import cardRouter from "./routes/cards";
import { RequestUser } from "./types/types";
import NotFoundError from "./errors/NotFound";

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use(express.json());

app.use((req: RequestUser, res: Response, next: NextFunction) => {
  req.user = {
    _id: "64be478182944317351bb4ca",
  };

  next();
});

app.use("/users", userRouter);
app.use("/cards", cardRouter);


app.all("*", (req: RequestUser, res: Response, next: NextFunction) =>
  next(new NotFoundError())
);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
