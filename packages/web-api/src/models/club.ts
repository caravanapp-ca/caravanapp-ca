import { model, Schema } from 'mongoose';
import {
  Club,
  ShelfEntry,
  FilterAutoMongoKeys,
  SameKeysAs,
} from '@caravan/buddy-reading-types';
import { Omit } from 'utility-types';
import { ClubDoc } from '../../typings';

const shelfSchemaDefinition: SameKeysAs<FilterAutoMongoKeys<ShelfEntry>> = {
  amazonId: { type: String },
  goodReadsId: { type: String },
  isbn: { type: String },
  readingState: { type: String, required: true },
  startedReading: { type: Date },
  finishedReading: { type: Date },
  title: { type: String, required: true },
  author: { type: String },
  publishedDate: { type: Date },
  coverImageURL: { type: String },
  genres: { type: [String], required: true },
};

const shelfSchema = new Schema(shelfSchemaDefinition, {
  timestamps: true,
});

const definition: Omit<SameKeysAs<FilterAutoMongoKeys<Club>>, 'members'> = {
  name: { type: String, required: true },
  bio: { type: String },
  maxMembers: { type: Number, required: true },
  vibe: { type: String },
  readingSpeed: { type: String },
  shelf: { type: [shelfSchema], required: true },
  ownerId: { type: String, required: true },
  ownerDiscordId: { type: String },
  channelSource: { type: String, required: true }, // discord always for now
  channelId: { type: String, required: true },
  private: { type: String, required: true },
};

const clubSchema = new Schema<ClubDoc>(definition, {
  timestamps: true,
});

export default model<ClubDoc>('Club', clubSchema);
