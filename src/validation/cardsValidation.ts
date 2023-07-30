import { body, param } from "express-validator";
import { regExp } from "../utils/constants";

export const createCardValidate = [
  body("name").not().isEmpty().withMessage("name is required").isLength({
    min: 2,
    max: 30,
  }),
  body("link").not().isEmpty().withMessage("link is required").matches(regExp),
];

export const updateCardValidate = [
  param("cardId")
    .not()
    .isEmpty()
    .withMessage("cardId is required")
    .isLength({ min: 24, max: 24 })
    .isHexadecimal()
    .withMessage("Invalid cardId"),
];
