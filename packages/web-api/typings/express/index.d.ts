import { UserDoc } from '@caravanapp/buddy-reading-mongo';

declare global {
  namespace Express {
    interface Request {
      user?: UserDoc;
    }
  }
}
