import { model, Schema } from 'mongoose';
import {
  User,
  FilterAutoMongoKeys,
  SameKeysAs,
} from '@caravan/buddy-reading-types';
import { UserDoc } from '../../typings/@caravan/buddy-reading-web-api';

const definition: SameKeysAs<FilterAutoMongoKeys<User>> = {
  bio: { type: String },
  discordId: { type: String, required: true, unique: true, index: true },
  name: { type: String },
  photoUrl: { type: String },
  readingSpeed: { type: String },
  isBot: { type: Boolean, required: true, default: false, index: true },
};

const userSchema = new Schema<UserDoc>(definition, {
  timestamps: true,
});

export default model<UserDoc>('User', userSchema);
