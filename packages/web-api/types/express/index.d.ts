import type { UserDoc } from '@caravanapp/mongo';
declare global {
  namespace Express {
    interface Request {
      user?: UserDoc;
    }
  }
}

export {};
