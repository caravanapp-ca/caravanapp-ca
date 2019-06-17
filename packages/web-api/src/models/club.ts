import { model, Schema } from 'mongoose';
import {
  ClubDoc,
  ShelfEntryDoc,
  FilterAutoMongoKeys,
  SameKeysAs,
} from '@caravan/buddy-reading-types';

const shelfDefinition: Required<
  SameKeysAs<FilterAutoMongoKeys<ShelfEntryDoc>>
> = {
  goodReadsId: { type: String },
  isbn: { type: String },
  readingState: { type: String, required: true },
  startedReading: { type: Date },
  finishedReading: { type: Date },
  title: { type: String, required: true },
  author: { type: String },
  publishedDate: { type: Date },
  coverImageURL: { type: String },
  genres: { type: [String] },
};

const shelfSchema = new Schema(shelfDefinition, {
  timestamps: true,
});

const definition: SameKeysAs<FilterAutoMongoKeys<ClubDoc>> = {
  name: { type: String, required: true },
  bio: { type: String },
  maxMembers: { type: Number },
  vibe: { type: String },
  readingSpeed: { type: String },
  shelf: { type: [shelfSchema] },
};

const clubSchema = new Schema(definition, {
  timestamps: true,
});

export default model('Club', clubSchema);
