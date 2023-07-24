
import { Router, NextFunction} from "express";

import { createCard, getAllCards, deleteCard } from "../controllers/cards";

export const cardRouter = Router();

cardRouter.post("/", createCard);
cardRouter.get("/", getAllCards);
cardRouter.delete("/:cardId", deleteCard);

export default cardRouter;
