import { Router } from "express";
import {
  createCard,
  getAllCards,
  deleteCard,
  likeCard,
  dislikeCard,
} from "../controllers/cards";
import {
  createCardValidate,
  updateCardValidate,
} from "../validation/cardsValidation";
import validateRequest from "../middlewares/validateRequest";

const cardRouter = Router();

cardRouter.get("/", getAllCards);

cardRouter.post("/", createCardValidate, validateRequest, createCard);
cardRouter.delete("/:cardId", updateCardValidate, validateRequest, deleteCard);
cardRouter.put("/:cardId/likes", updateCardValidate, validateRequest, likeCard);
cardRouter.delete(
  "/:cardId/likes",
  updateCardValidate,
  validateRequest,
  dislikeCard
);

export default cardRouter;
