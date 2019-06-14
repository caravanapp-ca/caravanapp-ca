declare module '@caravan/buddy-reading-types' {
  export interface Example {
    hello: string;
  }
  export interface UserDoc {
    _id: string;
    bio?: string;
    name?: string;
    photoUrl?: string;
    readingSpeed?: string;
    createdAt: Date;
    updatedAt: Date;
    _v: number;
  }

  export type ReadingState = 'notStarted' | 'current' | 'read';

  export interface ShelfEntryDoc {
    _id: string;
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
    name: string;
    bio?: string;
    maxMembers: number;
    vibe?: string;
    readingSpeed?: string;
    shelf?: [ShelfEntryDoc];
  }
}
