import mongoose, { ObjectId } from "mongoose";
import validator from "validator";

export interface ICard {
  name: string;
  link: string;
  owner: ObjectId;
  likes: [ObjectId];
  createdAt: Date;
}

const cardShema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: "This link isn't valid",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

export default mongoose.model<ICard>("card", cardShema);
