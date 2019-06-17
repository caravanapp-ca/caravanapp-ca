import { Document } from 'mongoose';

declare module '@caravan/buddy-reading-types' {
  type SubtractKeys<T, U> = {
    [K in keyof T]: K extends keyof U ? never : K
  }[keyof T];
  type Subtract<T, U> = { [K in SubtractKeys<T, U>]: T[K] };
  export type FilterAutoMongoKeys<Base> = Subtract<
    Base,
    MongoDocWithTimestamps
  >;
  // TODO: Improve by nesting the SameKeysAs
  export type SameKeysAs<Base> = { [Key in keyof Base]: any };

  export interface MongoDocWithTimestamps extends Document {
    createdAt: Date;
    updatedAt: Date;
  }

  export interface ClubDoc extends Document {
    name: string;
    bio?: string;
    maxMembers?: number;
  }

  export interface SessionDoc extends Document {
    accessToken: string;
    /** Milliseconds since January 1st, 1970 (use Date.now() to get current value) */
    accessTokenExpiresAt: number;
    refreshToken: string;
    scope: string;
    tokenType: 'Bearer';
    client: string;
    userId: string;
  }

  export interface UserDoc extends MongoDocWithTimestamps {
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

  export interface GroupMemberDoc extends UserDoc {
    role: string;
  }

  export type ReadingState = 'notStarted' | 'current' | 'read';

  export interface ShelfEntryDoc {
    _id: string;
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
    genres?: [string];
    createdAt: Date;
    updatedAt: Date;
    _v: number;
  }

  export interface ClubDoc {
    _id: string;
    ownerId: string;
    name: string;
    bio?: string;
    members: [GroupMemberDoc];
    maxMembers: number;
    vibe?: string;
    readingSpeed?: string;
    shelf?: [ShelfEntryDoc];
  }
}
