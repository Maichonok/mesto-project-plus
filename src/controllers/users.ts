import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RequestUser } from "../types/types";
import User from "../models/user";
import BadRequestError from "../errors/BadRequest";
import NotFoundError from "../errors/NotFound";
import ConflictError from "../errors/ConflictError";

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;
  return bcrypt.hash(password, 5).then((hash: string) => {
    User.findOne({ email })
      .then((data) => {
        if (data?.email === email) {
          return next(new ConflictError("This email is already in use"));
        }

        return User.create({ name, about, avatar, email, password: hash })
          .then((newUser) => {
            res.status(200).send(newUser);
          })
          .catch((error) => {
            if (
              error.name === "CastError" ||
              error.name === "ValidationError"
            ) {
              return next(new BadRequestError("Incorrect data"));
            }

            return next(error);
          });
      })
      .catch(next);
  });
};

export const allUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  User.findById(req.params.id)
    .then((data) => {
      if (!data) {
        return next(new NotFoundError());
      }

      return res.status(200).send(data);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return next(new BadRequestError("Incorrect data"));
      }

      return next(error);
    });
};

export const changeUserInfo = (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  const newName = req.body.name;
  const newAbout = req.body.about;
  User.findOneAndUpdate(
    { _id: req.user },
    { name: newName, about: newAbout },
    { new: true, runValidators: true }
  )
    .then((data) => {
      if (!data) {
        return next(new NotFoundError());
      }

      return res.status(200).send({ message: data });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return next(new BadRequestError(error.message));
      }

      return next(error);
    });
};

export const setNewAvatar = (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  const newAvatar = req.body.avatar;
  User.findOneAndUpdate(
    { _id: req.user },
    { avatar: newAvatar },
    { new: true, runValidators: true }
  )
    .then((data) => {
      if (!data) {
        return next(new NotFoundError());
      }

      return res.status(200).send({ message: data });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return next(new BadRequestError("Not valid data"));
      }

      return next(error);
    });
};

export const login = (req: RequestUser, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const id = String(user._id);
      const token = jwt.sign({ _id: id }, "secret", {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch(next);
};

export const currentUser = (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  User.findById(req.user?._id)
    .then((data) => {
      if (!data) {
        return next(new NotFoundError());
      }

      return res.status(200).send(data);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return next(new BadRequestError("Incorrect data"));
      }

      return next(error);
    });
};
