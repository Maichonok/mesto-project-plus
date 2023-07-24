import { Request, Response, NextFunction } from "express";
import { RequestUser } from "../types/types";
import card from "../models/card";

const { BadRequestError } = require("../errors/BadRequest");
const { NotFoundError } = require("../errors/NotFound");

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
      if (error.name === "BadRequest") {
        throw new BadRequestError("Incorrect data provided");
      }

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

export const likeCard = async (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  const data = await card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true }
  );

  if (!data) {
    throw new NotFoundError();
  }

  res.send(data);
};

export const dislikeCard = async (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  const data = await card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true }
  );

  if (!data) {
    throw new NotFoundError();
  }

  res.send(data);
};
