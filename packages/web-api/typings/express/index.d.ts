import { UserDoc } from '@caravan/buddy-reading-mongo';

declare global {
  namespace Express {
    interface Request {
      user?: UserDoc;
    }
  }
}
