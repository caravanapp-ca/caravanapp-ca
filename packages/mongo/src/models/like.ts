import { Document, model, Schema, Types } from 'mongoose';

import type { Likes, MongoTimestamps } from '@caravanapp/types';

import { MongooseSchema } from '../common/mongoose';

export interface LikesDoc
  extends Document,
    MongoTimestamps,
    Omit<Likes, '_id' | 'likes' | 'postId'> {
  _id: Types.ObjectId;
  postId: Types.ObjectId;
  likes: Types.ObjectId[];
}

const likesDefinition: MongooseSchema<Likes> = {
  postId: { type: Schema.Types.ObjectId, required: true, index: true },
  likes: [{ type: Schema.Types.ObjectId, required: true }],
  numLikes: { type: Number, required: true, default: 0 },
};

const likesSchema = new Schema<LikesDoc>(likesDefinition, {
  timestamps: true,
});

export const LikesModel = model<LikesDoc>('Likes', likesSchema);
