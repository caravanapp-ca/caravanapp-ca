import { Document, Types as MongooseTypes } from 'mongoose';
import { Omit } from 'utility-types';

declare module '@caravan/buddy-reading-types' {
  type SubtractKeys<T, U> = {
    [K in keyof T]: K extends keyof U ? never : K
  }[keyof T];
  type Subtract<T, U> = { [K in SubtractKeys<T, U>]: T[K] };
  export type FilterAutoMongoKeys<Base> = Subtract<
    Subtract<Base, MongoTimestamps>,
    DocumentFields
  >;
  // TODO: Improve by nesting the SameKeysAs
  export type SameKeysAs<Base> = { [Key in keyof Base]: any };

  export interface DocumentFields {
    _id: string;
    __v?: number;
  }

  export interface MongoTimestamps {
    createdAt: Date | string;
    updatedAt: Date | string;
  }

  export interface Club extends DocumentFields, MongoTimestamps {
    name: string;
    ownerId: string;
    shelf: ShelfEntry[];
    members: GroupMember[];
    bio?: string;
    maxMembers: number;
    vibe?: GroupVibe;
    readingSpeed?: ReadingSpeed;
  }

  export interface ClubDoc
    extends Document,
      Omit<FilterAutoMongoKeys<Club>, 'shelf' | 'members'> {
    _id: MongooseTypes.ObjectId;
    shelf: ShelfEntryDoc[];
    members: GroupMemberDoc[];
  }

  export interface GroupMember extends DocumentFields, MongoTimestamps {
    userId: string;
    role: string;
  }

  export interface GroupMemberDoc
    extends Document,
      Omit<FilterAutoMongoKeys<GroupMember>, 'userId'> {
    // Override the type to ensure that it's a string not _id?: any;
    _id: MongooseTypes.ObjectId;
    userId: MongooseTypes.ObjectId;
  }

  export interface Session extends DocumentFields {
    accessToken: string;
    /** Milliseconds since January 1st, 1970 (use Date.now() to get current value) */
    accessTokenExpiresAt: number;
    refreshToken: string;
    scope: string;
    tokenType: 'Bearer';
    client: string;
    userId: string;
  }

  export interface MemberInfo extends User {
    role: string;
  }

  export interface SessionDoc extends Document, FilterAutoMongoKeys<Session> {
    // Override the type to ensure that it's a string not _id?: any;
    _id: MongooseTypes.ObjectId;
  }

  export interface ShelfEntry extends MongoTimestamps {
    amazonId?: string;
    goodReadsId?: string;
    isbn?: string;
    readingState: ReadingState;
    startedReading?: Date;
    finishedReading?: Date;
    title: string;
    author?: string;
    publishedDate?: string;
    coverImageURL?: string;
    genres: string[];
  }

  export interface ShelfEntryDoc extends Document, ShelfEntry {
    _id: MongooseTypes.ObjectId;
  }

  export interface User extends DocumentFields, MongoTimestamps {
    bio?: string;
    discord: {
      id: string;
      username: string;
      discriminator: string;
      avatar?: string;
      bot?: boolean;
      mfa_enabled?: boolean;
      locale?: string;
      verified?: boolean;
      email?: string;
      flags?: number;
      premium_type?: number;
    };
    name?: string;
    photoUrl?: string;
    readingSpeed?: string;
  }

  export interface UserDoc extends Document, FilterAutoMongoKeys<User> {
    _id: MongooseTypes.ObjectId;
  }

  export type MembershipStatus = 'notMember' | 'member' | 'owner';

  export type ReadingState = 'notStarted' | 'current' | 'read';

  export type ReadingSpeed = 'slow' | 'moderate' | 'fast';

  export type GroupVibe =
    | 'chill'
    | 'power'
    | 'learning'
    | 'first-timers'
    | 'nerdy';
}
