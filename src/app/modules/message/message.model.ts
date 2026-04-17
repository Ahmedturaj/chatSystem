import mongoose, { Schema } from "mongoose";
import { IMessage } from "./message.interface";

const MessageSchema = new Schema<IMessage>(
    {
        group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
        sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

export const Message = mongoose.model<IMessage>('Message', MessageSchema);