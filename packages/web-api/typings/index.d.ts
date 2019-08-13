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
  ProfileQuestion,
  Badges,
  Referral,
  ReferralTiers,
  ClubShelf,
  UserPalettes,
  UserSettings,
  Post,
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

export interface BadgeDoc extends Document, Omit<Badges, '_id'> {
  _id: MongooseTypes.ObjectId;
}

export interface UserPalettesDoc extends Document, Omit<UserPalettes, '_id'> {
  _id: MongooseTypes.ObjectId;
}

export interface UserSettingsDoc extends Document, Omit<UserSettings, '_id'> {
  _id: MongooseTypes.ObjectId;
}

export interface ReferralTierDoc extends Document, Omit<ReferralTiers, '_id'> {
  _id: MongooseTypes.ObjectId;
}

export interface ProfileQuestionsDoc
  extends Document,
    MongoTimestamps,
    Omit<ProfileQuestions, '_id' | 'questions'> {
  _id: MongooseTypes.ObjectId;
  questions: (ProfileQuestion & { visible: boolean })[];
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

export interface ShelfEntryDoc extends Document, Omit<ShelfEntry, '_id'> {
  _id: MongooseTypes.ObjectId;
}

export interface UserDoc extends Document, Omit<User, '_id'> {
  _id: MongooseTypes.ObjectId;
}

export interface ReferralDoc
  extends Document,
    MongoTimestamps,
    Omit<Referral, '_id'> {
  _id: MongooseTypes.ObjectId;
}

export interface PostDoc extends Document, MongoTimestamps, Omit<Post, '_id'> {
  _id: MongooseTypes.ObjectId;
}
