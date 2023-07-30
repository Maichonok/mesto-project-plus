import { Router } from "express";
import {
  allUsers,
  getUserById,
  changeUserInfo,
  setNewAvatar,
  currentUser,
} from "../controllers/users";
import {
  getByIdValidate,
  updateAvatarValidate,
  updateUserValidate,
} from "../validation/userValidation";
import validateRequest from "../middlewares/validateRequest";

const userRouter = Router();

userRouter.get("/", allUsers);
userRouter.get("/me", currentUser);
userRouter.get("/:id", getByIdValidate, validateRequest, getUserById);
userRouter.patch("/me", updateUserValidate, validateRequest, changeUserInfo);
userRouter.patch(
  "/me/avatar",
  updateAvatarValidate,
  validateRequest,
  setNewAvatar
);

export default userRouter;
