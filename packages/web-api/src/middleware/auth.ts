import type { NextFunction, Request, Response } from 'express';

import { UserModel } from '@caravanapp/mongo';

export interface ErrorWithStatus extends Error {
  status?: number;
}

export async function isAuthenticated(
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
