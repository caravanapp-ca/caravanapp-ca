import { UserDoc } from '../';

declare global {
  namespace Express {
    interface Request {
      user?: UserDoc;
    }
  }
}
