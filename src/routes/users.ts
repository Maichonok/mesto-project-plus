import { Router } from "express";
import { createUser, allUsers, getUserById } from "../controllers/users";

export const userRouter = Router();

userRouter.post("/", createUser);
userRouter.get("/", allUsers);
userRouter.get("/:id", getUserById);

export default userRouter;
