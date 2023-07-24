
import { Router } from "express";

import { createCard, getAllCards, deleteCard, likeCard, dislikeCard } from "../controllers/cards";

const cardRouter = Router();

cardRouter.post("/", createCard);
cardRouter.get("/", getAllCards);
cardRouter.delete("/:cardId", deleteCard);
cardRouter.put("/:cardId/likes", likeCard);
cardRouter.delete("/:cardId/likes", dislikeCard);

export default cardRouter;
