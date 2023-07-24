import mongoose, { ObjectId } from "mongoose";

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
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

export default mongoose.model<ICard>("card", cardShema);
