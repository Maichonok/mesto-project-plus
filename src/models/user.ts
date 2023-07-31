import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import NotAuthorizedError from "../errors/UnauthorizedError";

interface IUser {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

const userShema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: "Invalid email",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "Жак-Ив Кусто",
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 200,
      default: "Исследователь",
    },
    avatar: {
      type: String,
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      validate: {
        validator: (v: string) => validator.isURL(v),
        message: "This link isn't valid",
      },
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        // eslint-disable-next-line no-param-reassign
        delete ret.password;
      }
    }
  }
);

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<mongoose.Document<unknown, any, IUser>>;
}

userShema.static(
  "findUserByCredentials",
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
      .select("+password")
      .then((existingUser: UserDoc) => {
        if (!existingUser) {
          return Promise.reject(new NotAuthorizedError("User does not exist"));
        }
        return bcrypt
          .compare(password, existingUser.password)
          .then((matched) => {
            if (!matched) {
              return Promise.reject(new NotAuthorizedError("Wrong password"));
            }

            return existingUser;
          });
      });
  }
);

const User = mongoose.model<IUser, UserModel>("user", userShema);

export default User;
