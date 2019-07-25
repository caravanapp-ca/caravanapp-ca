import { Request, Response, NextFunction } from 'express';
import { uuidv4 } from '../common/uuid';
import { handleFirstVisit } from '../services/referral';
import { ReferralSource } from '@caravan/buddy-reading-types';

interface ReferralParams {
  ref?: string;
  utm_source?: ReferralSource;
  utm_medium?: string;
}

const validUtmSources: { [key in ReferralSource]: boolean } = {
  facebook: true,
  personal: true,
  twitter: true,
};

export async function handleReferral(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { ref, utm_medium, utm_source } = req.params as ReferralParams;
  const userId: string | undefined = req.session.userId;

  const validatedUtmSource =
    utm_source && !validUtmSources[utm_source] ? undefined : utm_source;

  if (ref && !userId) {
    // If there's a ref in the URL and the user isn't signed in,
    // create a temp user id for referral tracking and store the onVisit
    // in the database
    let referredTempUid: string | undefined = req.session.referredTempUid;
    if (!referredTempUid) {
      referredTempUid = uuidv4();
      req.session.referredTempUid = referredTempUid;
      // Don't bother awaiting, fire-and-forget, no need to hold up execution
      handleFirstVisit(referredTempUid, ref, validatedUtmSource);
    }
  }
  next();
}
