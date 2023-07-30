import { Request, Response, NextFunction } from "express";
import { RequestUser } from "../types/types";
import Card from "../models/card";
import BadRequestError from "../errors/BadRequest";
import NotFoundError from "../errors/NotFound";
import NotAllowed from "../errors/NotAllowed";

export const createCard = (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  const { name, link } = req.body;

  const userId = req.user?._id;

  Card.create({ name, link, owner: userId })
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
  Card.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

export const deleteCard = async (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  Card.findById(req.params.cardId).then((card) => {
    if (!card) {
      return next(new NotFoundError());
    }
    if (card.owner.toString() !== req.user?._id) {
      return next(new NotAllowed("You are not allowed to delete the card"));
    }

    return Card.findOneAndRemove({ _id: req.params.cardId })
      .then((deleted) => res.send(deleted))
      .catch((error) => {
        if (error.name === "CastError") {
          return next(new BadRequestError("Incorrect data"));
        }
        return next(error);
      });
  });
};

export const likeCard = (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  Card.findByIdAndUpdate(
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
  await Card.findByIdAndUpdate(
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
