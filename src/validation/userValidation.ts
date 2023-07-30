import { body, param } from "express-validator";
import { regExp } from "../utils/constants";

export const getByIdValidate = [
  param("id")
    .not()
    .isEmpty()
    .withMessage("id is required")
    .isLength({ min: 24, max: 24 })
    .isHexadecimal(),
];

export const updateUserValidate = [
  body("name")
    .optional()
    .isLength({
      min: 2,
      max: 30,
    })
    .withMessage("The length must be between 2 and 30"),
  body("about")
    .optional()
    .isLength({
      min: 2,
      max: 30,
    })
    .withMessage("The length must be between 2 and 30"),
];

export const updateAvatarValidate = [
  body("avatar")
    .not()
    .isEmpty()
    .withMessage("Provide image url")
    .matches(regExp),
];
