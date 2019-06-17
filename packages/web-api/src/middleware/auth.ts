import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

export interface ErrorWithStatus extends Error {
  status?: number;
}

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userDoc = await User.findById(req.session.userId).exec();
    if (!userDoc) {
      const err = new Error('Unauthorized') as ErrorWithStatus;
      err.status = 401;
      return next(err);
    } else {
      req.user = userDoc;
      next();
    }
  } catch (err) {
    return next(err);
  }
}
