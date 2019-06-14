import { Subtract } from 'utility-types';

declare module '@caravan/buddy-reading-types' {
  // type SubtractKeys<T, U> = {
  //   [K in keyof T]: K extends keyof U ? never : K
  // }[keyof T];
  // type Subtract<T, U> = { [K in SubtractKeys<T, U>]: T[K] };
  export type FilterAutoMongoKeys<Base> = Subtract<Base, MongoDocWithTimestamps>;
  // TODO: Improve by nesting the SameKeysAs
  export type SameKeysAs<Base> = { [Key in keyof Base]: any };

  export interface MongoDoc {
    _id: string;
    _v: number;
  }

  export interface MongoDocWithTimestamps extends MongoDoc {
    createdAt: Date;
    updatedAt: Date;
  }

  export interface ClubDoc extends MongoDoc {
    name: string;
    bio?: string;
    maxMembers?: number;
  }

  export interface SessionDoc extends MongoDoc {
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
}