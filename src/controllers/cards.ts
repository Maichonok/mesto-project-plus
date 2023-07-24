import { Request, Response, NextFunction } from "express";
import { RequestUser } from "../types/types";
import card from "../models/card";

export const createCard = (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  const { name, link } = req.body;

  const userId = req.user?._id;

  card
    .create({ name, link, owner: userId })
    .then((data) => {
      res.status(200).send({ message: data });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
};

export const getAllCards = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  card
    .find({})
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      next(error);
    });
};

export const deleteCard = async (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  const data = await card
    .findOneAndRemove({ _id: req.params.cardId })
    .orFail(new Error("Roll number entered incorrected."));

  res.send(data);
};
