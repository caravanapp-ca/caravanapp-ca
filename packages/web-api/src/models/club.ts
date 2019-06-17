import { model, Schema } from 'mongoose';
import {
  ClubDoc,
  ShelfEntryDoc,
  FilterAutoMongoKeys,
  SameKeysAs,
  GroupMemberDoc,
} from '@caravan/buddy-reading-types';

const shelfSchemaDefinition: SameKeysAs<FilterAutoMongoKeys<ShelfEntryDoc>> = {
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

const memberSchemaDefinition: SameKeysAs<
  FilterAutoMongoKeys<GroupMemberDoc>
> = {
  userId: { type: Schema.Types.ObjectId, required: true },
  role: { type: String, required: true },
};

const memberSchema = new Schema(memberSchemaDefinition, {
  timestamps: true,
});

const definition: SameKeysAs<FilterAutoMongoKeys<ClubDoc>> = {
  name: { type: String, required: true },
  bio: { type: String },
  maxMembers: { type: Number, required: true },
  vibe: { type: String },
  readingSpeed: { type: String },
  shelf: { type: [shelfSchema], required: true },
  ownerId: { type: String, required: true },
  members: { type: [memberSchema], required: true },
};

const clubSchema = new Schema<ClubDoc>(definition, {
  timestamps: true,
});

export default model<ClubDoc>('Club', clubSchema);
