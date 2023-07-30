import { body } from "express-validator";
import { regExp } from "../utils/constants";

export const signupValidation = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("should be a valid email"),
  body("password").not().isEmpty().withMessage("Password is required"),
  body("name").optional().isLength({
    min: 2,
    max: 30,
  }),
  body("about").optional().isLength({
    min: 2,
    max: 200,
  }),
  body("avatar").optional().matches(regExp),
];

export const signinValidation = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("should be a valid email"),
  body("password").not().isEmpty().withMessage("Password is required"),
];
