import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

mongoose.set('strictQuery', false);

interface IUser {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
};

const userShema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: "invalid email",
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
});

interface UserModel extends mongoose.Model<UserDoc> {
  findUserByCredentials(email: string, password: string): Promise<UserDoc>;
};

const User = mongoose.model<UserDoc, UserModel>('user', userShema);

userShema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).then((existingUser: UserDoc) => {
    if (!existingUser) {
      return Promise.reject(new Error('User does not exist'));
    }

    return bcrypt.compare(password, existingUser.password).then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Wrong password'));
      }

      return existingUser;
    });
  });
});

export default User;
