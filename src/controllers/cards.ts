import { Request, Response, NextFunction } from "express";
import { RequestUser } from "../types/types";
import card from "../models/card";

const BadRequestError = require("../errors/BadRequest");
const NotFoundError = require("../errors/NotFound");

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
        return next(new BadRequestError("Incorrect data provided"));
      }

      return next(error);
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

export const deleteCard = (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  card
    .findOneAndRemove({ _id: req.params.cardId })
    .then((data) => {
      if (!data) {
        return next(NotFoundError());
      }

      return res.send(data);
    })
    .catch((error) => next(error));
};

export const likeCard = (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true }
    )
    .then((data) => {
      if (!data) {
        return next(NotFoundError());
      }

      return res.send(data);
    })
    .catch((error) => {
      next(error);
    });
};

export const dislikeCard = async (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  await card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true }
    )
    .then((data) => {
      if (!data) {
        return next(NotFoundError());
      }

      return res.send(data);
    })
    .catch((error) => {
      next(error);
    });
};
