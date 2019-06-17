import { UserDoc } from '@caravan/buddy-reading-types';

declare global {
  namespace Express {
    interface Request {
      user?: UserDoc;
    }
  }
}
