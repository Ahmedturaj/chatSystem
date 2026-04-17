import mongoose, { Document } from "mongoose";

export interface IMessage extends Document {
  group: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}