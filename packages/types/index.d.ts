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
}
