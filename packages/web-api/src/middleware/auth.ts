import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user';

export interface ErrorWithStatus extends Error {
  status?: number;
}

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userDoc = await UserModel.findById(req.session.userId);
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
