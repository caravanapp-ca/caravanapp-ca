import { Document, model, Schema, Types } from 'mongoose';
import {
  BookSource,
  PaletteObject,
  User,
  UserBadge,
  UserQA,
  UserShelfEntry,
} from '@caravanapp/buddy-reading-types';
import { ALLOWED_BOOK_SOURCES } from '../common/club';
import { MongooseSchema } from '../common/mongoose';

export interface UserDoc extends Document, Omit<User, '_id'> {
  _id: Types.ObjectId;
}

const selectedGenreDefinition: MongooseSchema<User['selectedGenres'][0]> = {
  key: { type: String, required: true },
  name: { type: String, required: true },
};

const selectedGenreSchema = new Schema(selectedGenreDefinition, { _id: false });

const questionsDefinition: MongooseSchema<UserQA> = {
  id: { type: String, required: true },
  title: { type: String, required: true },
  answer: { type: String, required: true },
  userVisible: { type: Boolean, required: true, default: true },
  sort: { type: Number, required: true },
};

const questionsSchema = new Schema(questionsDefinition, { _id: false });

const userShelfEntryDefinition: MongooseSchema<UserShelfEntry> = {
  source: {
    type: String,
    required: true,
    index: true,
    validate: {
      validator: function(v: BookSource) {
        return ALLOWED_BOOK_SOURCES[v] === true;
      },
    },
  },
  sourceId: { type: String, required: true, index: true },
  // All the same stuff from club shelves
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
  amazonLink: { type: String },
};

const userShelfEntrySchema = new Schema(userShelfEntryDefinition);

const mapUserShelfDefinition: MongooseSchema<Omit<User['shelf'], 'current'>> = {
  notStarted: { type: [userShelfEntrySchema], required: true },
  read: { type: [userShelfEntrySchema], required: true },
};

const mapUserShelfSchema = new Schema(mapUserShelfDefinition, {
  _id: false,
});

const paletteDefinition: MongooseSchema<PaletteObject> = {
  id: { type: String, required: true },
  key: { type: String, required: true },
  textColor: { type: String, required: true },
  bgImage: { type: String },
  set: { type: String },
  mobileAlignment: { type: String },
};

const paletteSchema = new Schema(paletteDefinition, {
  _id: false,
  timestamps: true,
});

const userBadgeDefinition: MongooseSchema<UserBadge> = {
  key: { type: String, required: true },
  name: { type: String, required: true },
  awardedOn: { type: Date, required: true },
  description: { type: String },
};

const userBadgeSchema = new Schema(userBadgeDefinition);

const userDefinition: MongooseSchema<Omit<User, 'discordUsername'>> = {
  bio: { type: String },
  discordId: { type: String, required: true, unique: true, index: true },
  goodreadsUrl: { type: String },
  website: { type: String },
  name: { type: String },
  selectedGenres: { type: [selectedGenreSchema], required: true, default: [] },
  photoUrl: { type: String },
  smallPhotoUrl: { type: String },
  readingSpeed: { type: String, default: 'moderate' },
  age: { type: Number },
  gender: { type: String },
  location: { type: String },
  isBot: { type: Boolean, required: true, default: false, index: true },
  urlSlug: { type: String, required: true, unique: true, index: true },
  questions: { type: [questionsSchema], required: true, default: [] },
  shelf: {
    type: { mapUserShelfSchema },
    required: true,
    default: {
      notStarted: [],
      read: [],
    },
  },
  onboardingVersion: { type: Number, required: true, default: 0 },
  palette: { type: paletteSchema, default: null },
  badges: { type: [userBadgeSchema], required: true, default: [] },
};

const userSchema = new Schema<UserDoc>(userDefinition, {
  timestamps: true,
});

export const UserModel = model<UserDoc>('User', userSchema);
