import { Document } from 'mongoose';

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
    shelf: ShelfEntryDoc[];
    members: GroupMemberDoc[];
    bio?: string;
    maxMembers: number;
    vibe?: GroupVibe;
    readingSpeed?: ReadingSpeed;
  }

  export interface ClubDoc extends Document, Club {
    // Override the type to ensure that it's a string not _id?: any;
    _id: string;
  }

  export interface GroupMember extends DocumentFields, MongoTimestamps {
    userId: string;
    role: string;
  }

  export interface GroupMemberDoc extends GroupMember, Document {
    // Override the type to ensure that it's a string not _id?: any;
    _id: string;
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

  export interface SessionDoc extends Document, Session {
    // Override the type to ensure that it's a string not _id?: any;
    _id: string;
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

  export interface ShelfEntryDoc extends ShelfEntry, Document {}

  export interface User extends DocumentFields, MongoTimestamps {
    userId: string;
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

  export interface UserDoc extends Document, User {
    _id: string;
  }

  export type ReadingState = 'notStarted' | 'current' | 'read';

  export type ReadingSpeed = 'slow' | 'moderate' | 'fast';

  export type GroupVibe =
    | 'chill'
    | 'power'
    | 'learning'
    | 'first-timers'
    | 'nerdy';
}
