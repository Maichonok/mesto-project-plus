import express from "express";
import mongoose from "mongoose";
import errorHandler from "./middlewares/ErrorHandler";
import { requestLogger, errorLogger } from './middlewares/Logger';
import router from "./routes";
import { PORT, MONGO_URI } from "./configs";

const app = express();

mongoose.connect(MONGO_URI);

app.use(express.json());

app.use(requestLogger);
app.use("/", router);
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
