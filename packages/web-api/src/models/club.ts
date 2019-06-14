import { model, Schema } from 'mongoose';
import {
  ClubDoc,
  FilterAutoMongoKeys,
  SameKeysAs,
} from '@caravan/buddy-reading-types';

const definition: SameKeysAs<FilterAutoMongoKeys<ClubDoc>> = {
  name: { type: String, required: true },
  bio: { type: String },
  maxMembers: { type: Number },
};

const clubSchema = new Schema(definition, {
  timestamps: true,
});

export default model('Club', clubSchema);
