import { Document, model, Schema, Types } from 'mongoose';

import type {
  BookSource,
  Club,
  ClubBotSettings,
  ClubReadingSchedule,
  ClubShelf,
  Discussion,
  ShelfEntry,
} from '@caravanapp/types';

import { ALLOWED_BOOK_SOURCES } from '../common/club';
import { MongooseSchema } from '../common/mongoose';

export interface ShelfEntryDoc extends Document, Omit<ShelfEntry, '_id'> {
  _id: Types.ObjectId;
}

export interface ClubDoc extends Document, Omit<Club, 'shelf' | '_id'> {
  _id: Types.ObjectId;
  shelf: ShelfEntryDoc[];
}

export interface ClubRecommendationDoc extends ClubDoc {
  order?: number;
  tbrMatches?: string[];
  genreMatches?: string[];
}

export const genresSchema = new Schema({
  key: String,
  name: String,
});

export const shelfSchemaDefinition: MongooseSchema<ShelfEntry> = {
  amazonLink: { type: String },
  author: { type: String },
  coverImageURL: { type: String },
  finishedReading: { type: Date },
  genres: { type: [String], required: true },
  isbn: { type: String },
  publishedDate: { type: Date },
  readingState: { type: String, required: true },
  source: {
    type: String,
    required: true,
    index: true,
    validate: {
      validator: function (v: BookSource): boolean {
        return ALLOWED_BOOK_SOURCES[v] === true;
      },
    },
  },
  sourceId: { type: String, required: true, index: true },
  startedReading: { type: Date },
  title: { type: String, required: true },
};

const shelfSchema = new Schema(shelfSchemaDefinition, {
  timestamps: true,
});

const clubShelfDefinition: MongooseSchema<ClubShelf> = {
  current: { type: [shelfSchema], required: true, default: [] },
  notStarted: { type: [shelfSchema], required: true, default: [] },
  read: { type: [shelfSchema], required: true, default: [] },
};

const clubShelfSchema = new Schema(clubShelfDefinition, { _id: false });

const scheduleDiscussionDefinition: MongooseSchema<Discussion> = {
  date: { type: Date, required: true },
  format: String,
  label: String,
};

const scheduleDiscussionSchema = new Schema(scheduleDiscussionDefinition);

const scheduleSchemaDefinition: MongooseSchema<ClubReadingSchedule> = {
  discussionFrequency: { type: Number },
  discussions: { type: [scheduleDiscussionSchema], required: true },
  duration: { type: Number, required: true },
  shelfEntryId: { type: String, required: true },
  startDate: { type: Date, required: true },
};

const scheduleSchema = new Schema(scheduleSchemaDefinition);

const botSettingsDefinition: MongooseSchema<ClubBotSettings> = {
  intros: { type: Boolean, required: true },
};

const botSettingsSchema = new Schema(botSettingsDefinition, { _id: false });

const clubDefinition: MongooseSchema<Omit<Club, 'members'>> = {
  bio: { type: String },
  botSettings: { type: botSettingsSchema, required: true },
  channelId: { type: String, required: true },
  channelSource: { type: String, required: true }, // discord always for now
  genres: { type: [genresSchema], required: true },
  maxMembers: { type: Number, required: true },
  name: { type: String, required: true },
  newShelf: { type: clubShelfSchema, required: true },
  ownerDiscordId: { type: String },
  ownerId: { type: String, required: true },
  readingSpeed: { type: String },
  schedules: { type: [scheduleSchema], required: true },
  shelf: { type: [shelfSchema] },
  unlisted: { type: Boolean, required: true },
  vibe: { type: String },
};

const clubSchema = new Schema<ClubDoc>(clubDefinition, {
  timestamps: true,
});

export const ClubModel = model<ClubDoc>('Club', clubSchema);
