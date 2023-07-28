import { Request, Response, NextFunction } from "express";
import { JwtPayload } from 'jsonwebtoken';
import { RequestUser } from "../types/types";
import card from "../models/card";
import BadRequestError from "../errors/BadRequest";
import NotFoundError from "../errors/NotFound";

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
      if (error.name === "ValidationError") {
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
    .catch(next);
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
        return next(new NotFoundError());
      }

      return res.send(data);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return next(new BadRequestError("Incorrect data"));
      }
      return next(error);
    });
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
        return next(new NotFoundError());
      }

      return res.send(data);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return next(new BadRequestError("Incorrect data"));
      }
      return next(error);
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
        return next(new NotFoundError());
      }

      return res.send(data);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return next(new BadRequestError("Incorrect data"));
      }
      return next(error);
    });
};
