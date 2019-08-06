import { model, Schema } from 'mongoose';
import { Omit } from 'utility-types';
import {
  Club,
  ShelfEntry,
  FilterAutoMongoKeys,
  SameKeysAs,
  BookSource,
  ClubReadingSchedule,
  Discussion,
} from '@caravan/buddy-reading-types';
import { ClubDoc } from '@caravan/buddy-reading-mongo';
import { ALLOWED_BOOK_SOURCES } from '../common/club';

const genresSchema = new Schema({
  key: String,
  name: String,
});

const shelfSchemaDefinition: SameKeysAs<FilterAutoMongoKeys<ShelfEntry>> = {
  source: {
    type: String,
    required: true,
    index: true,
    validate: {
      validator: function(v: BookSource) {
        return ALLOWED_BOOK_SOURCES[v] === true;
      },
      message: function(props: { value: string }) {
        `${props.value} is not a valid source.`;
      },
    },
  },
  sourceId: { type: String, required: true, index: true },
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

const scheduleDiscussionDefinition: SameKeysAs<
  FilterAutoMongoKeys<Discussion>
> = {
  date: { type: Date, required: true },
  label: String,
  format: String,
};

const scheduleDiscussionSchema = new Schema(scheduleDiscussionDefinition);

const scheduleSchemaDefinition: SameKeysAs<
  FilterAutoMongoKeys<ClubReadingSchedule>
> = {
  shelfEntryId: { type: String, required: true },
  startDate: { type: Date, required: true },
  duration: { type: Number, required: true },
  discussionFrequency: { type: Number },
  discussions: { type: [scheduleDiscussionSchema], required: true },
};

const scheduleSchema = new Schema(scheduleSchemaDefinition);

const definition: Omit<SameKeysAs<FilterAutoMongoKeys<Club>>, 'members'> = {
  name: { type: String, required: true },
  bio: { type: String },
  maxMembers: { type: Number, required: true },
  vibe: { type: String },
  readingSpeed: { type: String },
  genres: { type: [genresSchema], required: true },
  shelf: { type: [shelfSchema], required: true },
  schedules: { type: [scheduleSchema], required: true },
  ownerId: { type: String, required: true },
  ownerDiscordId: { type: String },
  channelSource: { type: String, required: true }, // discord always for now
  channelId: { type: String, required: true },
  unlisted: { type: Boolean, required: true },
};

const clubSchema = new Schema<ClubDoc>(definition, {
  timestamps: true,
});

export const ClubModel = model<ClubDoc>('Club', clubSchema);
