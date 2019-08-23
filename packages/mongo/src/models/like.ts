import { model, Schema, Types, Document } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  Likes,
  MongoTimestamps,
} from '@caravan/buddy-reading-types';

export interface LikesDoc
  extends Document,
    MongoTimestamps,
    Omit<Likes, '_id'> {
  _id: Types.ObjectId;
}

const likesDefinition: SameKeysAs<FilterAutoMongoKeys<Likes>> = {
  postId: { type: Schema.Types.ObjectId, required: true },
  likes: [{ type: Schema.Types.ObjectId, required: true }],
  numLikes: { type: Number, required: true, default: 0 },
};

const likesSchema = new Schema<LikesDoc>(likesDefinition, {
  timestamps: true,
});

export const LikesModel = model<LikesDoc>('Likes', likesSchema);
