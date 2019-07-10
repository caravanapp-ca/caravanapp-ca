import { model, Schema } from 'mongoose';
import {
  Club,
  ShelfEntry,
  FilterAutoMongoKeys,
  SameKeysAs,
  BookSource,
} from '@caravan/buddy-reading-types';
import { Omit } from 'utility-types';
import { ALLOWED_BOOK_SOURCES } from '../common/club';
import { ClubDoc } from '../../typings';

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

const scheduleDiscussionSchema = new Schema({
  date: { type: Date, required: true },
  format: String,
});

const scheduleSchema = new Schema({
  shelfEntryId: { type: String, required: true },
  startDate: { type: Date, required: true },
  duration: { type: Number, required: true },
  discussionFrequency: { type: Number },
  discussions: { type: [scheduleDiscussionSchema], required: true },
});

const definition: Omit<SameKeysAs<FilterAutoMongoKeys<Club>>, 'members'> = {
  name: { type: String, required: true },
  bio: { type: String },
  maxMembers: { type: Number, required: true },
  vibe: { type: String },
  readingSpeed: { type: String },
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

export default model<ClubDoc>('Club', clubSchema);
