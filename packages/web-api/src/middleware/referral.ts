import { Request, Response, NextFunction } from 'express';
import { uuidv4 } from '../common/uuid';
import { handleFirstVisit } from '../services/referral';

interface ReferralParams {
  ref?: string;
  utm_source?: string;
  utm_medium?: string;
}

export async function handleReferral(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { ref, utm_source, utm_medium } = req.params as ReferralParams;
  const userId: string | undefined = req.session.userId;
  // If there's a ref in the URL and the user isn't signed in,
  // create a temp user id for referral tracking and store the onVisit
  // in the database
  if (ref && !userId) {
    let referredTempUid: string | undefined = req.session.referredTempUid;
    if (!referredTempUid) {
      referredTempUid = uuidv4();
      req.session.referredTempUid = referredTempUid;
      // Don't bother awaiting, fire-and-forget, no need to hold up execution
      handleFirstVisit(referredTempUid, ref);
    }
  }
}
