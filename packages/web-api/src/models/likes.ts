import { model, Schema } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  Like,
  Likes,
} from '@caravan/buddy-reading-types';
import { LikesDoc } from '../../typings';

const likeDefinitionSchema: SameKeysAs<FilterAutoMongoKeys<Like>> = {
  userId: { type: String, required: true },
  userPhotoUrl: { type: String, required: true },
  username: { type: String, required: true },
};

const likeSchema = new Schema(likeDefinitionSchema, {
  _id: false,
});

const likesDefinition: SameKeysAs<FilterAutoMongoKeys<Likes>> = {
  likes: { type: [likeSchema], required: true },
};

const likesSchema = new Schema<LikesDoc>(likesDefinition, {
  timestamps: true,
});

export default model<LikesDoc>('Likes', likesSchema);
