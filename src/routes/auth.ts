import { Router } from "express";
import { createUser, login } from "../controllers/users";
import {
  signinValidation,
  signupValidation,
} from "../validation/authValidation";
import validateRequest from "../middlewares/validateRequest";

const authRouter = Router();

authRouter.post("/signin", signinValidation, validateRequest, login);
authRouter.post("/signup", signupValidation, validateRequest, createUser);

export default authRouter;
