import { model, Schema, Mongoose } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  Like,
  Likes,
} from '@caravan/buddy-reading-types';
import { LikesDoc } from '../../typings';
import user from './user';

const likesDefinition: SameKeysAs<FilterAutoMongoKeys<Likes>> = {
  likes: { type: [String], required: true },
};

const likesSchema = new Schema<LikesDoc>(likesDefinition, {
  timestamps: true,
});

export default model<LikesDoc>('Likes', likesSchema);
