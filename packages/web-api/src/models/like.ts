import { model, Schema } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  Like,
  Likes,
} from '@caravan/buddy-reading-types';
import { LikesDoc } from '../../typings';

const likesDefinition: SameKeysAs<FilterAutoMongoKeys<Likes>> = {
  likes: { type: [String], required: true },
};

const likesSchema = new Schema<LikesDoc>(likesDefinition, {
  timestamps: true,
});

export default model<LikesDoc>('Likes', likesSchema);
