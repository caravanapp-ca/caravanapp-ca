import { UserDoc } from '@caravanapp/mongo';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserDoc;
  }
}

export {};
