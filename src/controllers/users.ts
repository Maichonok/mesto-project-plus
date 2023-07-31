import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Error } from "mongoose";
import { RequestUser } from "../types/types";
import User, { UserDoc } from "../models/user";
import BadRequestError from "../errors/BadRequest";
import UnauthorizedError from "../errors/UnauthorizedError";
import NotFoundError from "../errors/NotFound";

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;

  return bcrypt.hash(password, 5).then((hash: string) => {
    User.create({ name, about, avatar, email, password: hash })
      .then((newUser) => {
        res.status(200).send(newUser);
      })
      .catch((error) => {
        if (error instanceof Error.ValidationError) {
          return next(new BadRequestError("Incorrect data"));
        }

        if (error.code === 11000) {
          return next(new UnauthorizedError("This email is already in use"));
        }

        return next(error);
      });
  });
};

export const allUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

const updateUser = (
  fields: string[],
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  User.findOneAndUpdate(
    { _id: req.user },
    fields.reduce(
      (acc, key) => ({
        ...acc,
        key: req.body[key],
      }),
      {}
    ),
    { new: true, runValidators: true }
  )
    .then((data) => {
      if (!data) {
        return next(new NotFoundError());
      }

      return res.status(200).send({ message: data });
    })
    .catch((error) => {
      if (error instanceof Error.ValidationError) {
        return next(new BadRequestError(error.message));
      }

      return next(error);
    });
};

const updateUserInfo = (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  updateUser(["name", "about"], req, res, next);
};

const updateAvatar = (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  updateUser(["avatar"], req, res, next);
};

export const changeUserInfo = (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  updateUserInfo(req, res, next);
};

export const setNewAvatar = (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  updateAvatar(req, res, next);
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

const findUserById = async (
  res: Response,
  next: NextFunction,
  id: string = ""
): Promise<UserDoc | null> => {
  try {
    const user = await User.findById(id);

    if (!user) {
      next(new NotFoundError());
      return null;
    }
    res.status(200).send(user);

    return user;
  } catch (e) {
    next(e);
    return null;
  }
};

const cachingDecorator = (func: Function) => {
  const cache = new Map();

  return async (res: Response, next: NextFunction, id: string = "") => {
    if (cache.has(id)) {
      return res.send(cache.get(id));
    }

    const result = await func(res, next, id);
    if (result) {
      cache.set(id, result);
    }
    return result;
  };
};

const findUserCached = cachingDecorator(findUserById);

export const currentUser = (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => findUserCached(res, next, req.user?._id);

export const getUserById = (req: Request, res: Response, next: NextFunction) =>
  findUserCached(res, next, req.params.id);
