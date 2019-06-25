import { model, Schema } from 'mongoose';
import {
  User,
  FilterAutoMongoKeys,
  SameKeysAs,
} from '@caravan/buddy-reading-types';
import { UserDoc } from '../../typings';

const definition: SameKeysAs<FilterAutoMongoKeys<User>> = {
  bio: { type: String },
  discordId: { type: String, required: true, unique: true, index: true },
  goodreadsUrl: { type: String },
  website: { type: String },
  name: { type: String },
  photoUrl: { type: String },
  smallPhotoUrl: { type: String },
  readingSpeed: { type: String },
  age: { type: Number },
  gender: { type: String },
  location: { type: String },
  isBot: { type: Boolean, required: true, default: false, index: true },
  urlSlug: { type: String, required: true, unique: true, index: true },
};

const userSchema = new Schema<UserDoc>(definition, {
  timestamps: true,
});

export default model<UserDoc>('User', userSchema);
