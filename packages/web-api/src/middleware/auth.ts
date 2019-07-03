import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user';

export interface ErrorWithStatus extends Error {
  status?: number;
}

export async function isOnboarded(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userDoc = await UserModel.findById(req.session.userId).exec();
    if (!userDoc) {
      const err = new Error('Unauthorized') as ErrorWithStatus;
      err.status = 401;
      return next(err);
      // Will coerce !0 to true, !1 to false, !undefined to true
    } else if (!userDoc.onboardingVersion) {
      res.redirect('/onboarding');
      return;
    } else {
      req.user = userDoc;
      next();
    }
  } catch (err) {
    return next(err);
  }
}

export async function isAuthenticatedButNotNecessarilyOnboarded(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userDoc = await UserModel.findById(req.session.userId).exec();
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
