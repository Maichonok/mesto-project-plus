import { Router } from "express";
import { createUser, allUsers, getUserById, changeUserInfo, setNewAvatar, login } from "../controllers/users";

const userRouter = Router();

userRouter.get("/", allUsers);
userRouter.get("/:id", getUserById);
userRouter.get("/me", changeUserInfo);
userRouter.patch("/me", changeUserInfo);
userRouter.patch("/me/avatar", setNewAvatar);
userRouter.post('/signin', login);
userRouter.post("/signup", createUser);

export default userRouter;

