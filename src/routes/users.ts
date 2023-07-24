import { Router } from "express";
import { createUser, allUsers, getUserById, changeUserInfo, setNewAvatar } from "../controllers/users";

const userRouter = Router();

userRouter.post("/", createUser);
userRouter.get("/", allUsers);
userRouter.get("/:id", getUserById);
userRouter.patch("/me", changeUserInfo);
userRouter.patch("/me/avatar", setNewAvatar);

export default userRouter;

