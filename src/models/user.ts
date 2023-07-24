import mongoose from "mongoose";

// TS-интерфейс модели User
interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userShema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUser>("user", userShema);
