import {
  Club,
  FilterAutoMongoKeys,
  GroupMember,
  Session,
  ShelfEntry,
  User,
  Genres,
  ProfileQuestions,
  MongoTimestamps,
} from '@caravan/buddy-reading-types';
import { Document, Types as MongooseTypes } from 'mongoose';
import { Omit } from 'utility-types';

export interface ClubDoc extends Document, Omit<Club, 'shelf' | '_id'> {
  _id: MongooseTypes.ObjectId;
  shelf: ShelfEntryDoc[];
}

export interface GenreDoc extends Document, Omit<Genres, '_id'> {
  _id: MongooseTypes.ObjectId;
}

export interface ProfileQuestionsDoc
  extends Document,
    MongoTimestamps,
    Omit<ProfileQuestions, '_id'> {
  _id: MongooseTypes.ObjectId;
}

export interface GroupMemberDoc
  extends Document,
    Omit<FilterAutoMongoKeys<GroupMember>, 'userId'> {
  // Override the type to ensure that it's a string not _id?: any;
  _id: MongooseTypes.ObjectId;
  userId: MongooseTypes.ObjectId;
}

export interface SessionDoc extends Document, FilterAutoMongoKeys<Session> {
  // Override the type to ensure that it's a string not _id?: any;
  _id: MongooseTypes.ObjectId;
}

export interface ShelfEntryDoc
  extends Document,
    FilterAutoMongoKeys<ShelfEntry> {
  _id: MongooseTypes.ObjectId;
}

export interface UserDoc extends Document, FilterAutoMongoKeys<User> {
  _id: MongooseTypes.ObjectId;
}
