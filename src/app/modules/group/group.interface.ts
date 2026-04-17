import mongoose, { Document } from 'mongoose';

export interface IGroup extends Document {
    name: string;
    description?: string;
    creator: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}