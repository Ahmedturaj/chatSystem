import mongoose, { Schema } from "mongoose";
import { IGroup } from "./group.interface";

const GroupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model<IGroup>('Group', GroupSchema);