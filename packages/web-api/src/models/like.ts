import { model, Schema, Mongoose, Types } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  Like,
  Likes,
} from '@caravan/buddy-reading-types';
import { LikesDoc } from '../../typings';
import user from './user';

const likesDefinition: SameKeysAs<FilterAutoMongoKeys<Likes>> = {
  postId: { type: Schema.Types.ObjectId, required: true },
  likes: [{ type: Schema.Types.ObjectId, required: true }],
  numLikes: { type: Number, required: true, default: 0 },
};

const likesSchema = new Schema<LikesDoc>(likesDefinition, {
  timestamps: true,
});

export default model<LikesDoc>('Likes', likesSchema);
