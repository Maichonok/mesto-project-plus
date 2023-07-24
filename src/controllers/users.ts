import { Request, Response, NextFunction } from "express";
import { RequestUser } from "../types/types";
import user from "../models/user";

const { BadRequestError } = require("../errors/BadRequest");
const { NotFoundError } = require("../errors/NotFound");

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  user
    .create({ name, about, avatar })
    .then((data) => {
      res.status(200).send({ message: data });
    })
    .catch((error) => {
      if (error.name === "BadRequest") {
        throw new BadRequestError("Incorrect data was transmitted when creating a user");
      } else {
        next(error);
      }
    });
};

export const allUsers = (req: Request, res: Response, next: NextFunction) => {
  user
    .find({})
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      next(error);
    });
};

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  user
    .findById(req.params.id)
    .then((data) => {
      if (!data) {
        throw new NotFoundError();
      }
      res.status(200).send(data);
    })
    .catch((error) => {
      next(error);
    });
};

export const changeUserInfo = (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  const newName = req.body.name;
  const newAbout = req.body.about;
  user.findOneAndUpdate(
    { _id: req.user },
    { name: newName, about: newAbout },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((data) => {
      res.status(200).send({ message: data });
    })
    .catch((err) => {
      if (err.name === 'BadRequest') {
        throw new BadRequestError('Not valid data');
      } else {
        next(err);
      }
    });
};

export const setNewAvatar = (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  const newAvatar = req.body.avatar;
  user.findOneAndUpdate(
    { _id: req.user },
    { avatar: newAvatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((data) => {
      res.status(200).send({ message: data });
    })
    .catch((err) => {
      if (err.name === 'BadRequest') {
        throw new BadRequestError('Not valid data');
      } else {
        next(err);
      }
    });
};