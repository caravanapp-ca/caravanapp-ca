import { model, Schema } from 'mongoose';
import {
  User,
  FilterAutoMongoKeys,
  SameKeysAs,
  UserQA,
  UserShelfEntry,
} from '@caravan/buddy-reading-types';
import { UserDoc } from '../../typings';

const selectedGenreDefinition: SameKeysAs<User['selectedGenres'][0]> = {
  key: { type: String, required: true },
  name: { type: String, required: true },
};

const selectedGenreSchema = new Schema(selectedGenreDefinition, { _id: false });

const questionsDefinition: SameKeysAs<UserQA> = {
  id: { type: String, required: true },
  title: { type: String, required: true },
  answer: { type: String, required: true },
  userVisible: { type: Boolean, required: true, default: true },
  sort: { type: Number, required: true },
};

const questionsSchema = new Schema(questionsDefinition, { _id: false });

const userShelfEntryDefinition: SameKeysAs<
  FilterAutoMongoKeys<UserShelfEntry>
> = {
  // All the same stuff from club shelves
  amazonId: { type: String },
  goodReadsId: { type: String },
  isbn: { type: String },
  startedReading: { type: Date },
  finishedReading: { type: Date },
  title: { type: String, required: true },
  author: { type: String },
  publishedDate: { type: Date },
  coverImageURL: { type: String },
  genres: { type: [String], required: true },
  // Unique for user shelves compared to club shelves
  clubId: { type: String },
  club: { type: Object },
  // Can't have readingState as current; too lazy to validate at this level
  readingState: { type: String, required: true },
};

const userShelfEntrySchema = new Schema(userShelfEntryDefinition, {
  _id: false,
});

const mapUserShelfDefinition: any = {
  notStarted: { type: [userShelfEntrySchema], required: true, default: [] },
  read: { type: [userShelfEntrySchema], required: true, default: [] },
};

const mapUserShelfSchema = new Schema(mapUserShelfDefinition, {
  _id: false,
});

const definition: SameKeysAs<FilterAutoMongoKeys<User>> = {
  bio: { type: String },
  discordId: { type: String, required: true, unique: true, index: true },
  goodreadsUrl: { type: String },
  website: { type: String },
  name: { type: String },
  selectedGenres: { type: [selectedGenreSchema], required: true, default: [] },
  photoUrl: { type: String },
  smallPhotoUrl: { type: String },
  readingSpeed: { type: String },
  age: { type: Number },
  gender: { type: String },
  location: { type: String },
  isBot: { type: Boolean, required: true, default: false, index: true },
  urlSlug: { type: String, required: true, unique: true, index: true },
  questions: { type: [questionsSchema], required: true, default: [] },
  shelf: {
    type: mapUserShelfSchema,
    required: true,
  },
  onboardingVersion: { type: Number, required: true, default: 0 },
};

const userSchema = new Schema<UserDoc>(definition, {
  timestamps: true,
});

export default model<UserDoc>('User', userSchema);
