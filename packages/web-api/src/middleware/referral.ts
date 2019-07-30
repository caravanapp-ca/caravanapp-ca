import { Request, Response, NextFunction } from 'express';
import generateUuid from 'uuid/v4';
import { ReferralSource } from '@caravan/buddy-reading-types';
import { handleFirstVisit } from '../services/referral';

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
  const { utm_medium, utm_source } = req.params as ReferralParams;
  let { ref } = req.params as ReferralParams;
  const userId: string | undefined = req.session.userId;

  if (!ref) {
    try {
      ref = req.cookies['ref'];
    } catch (err) {
      console.error('Failed to get cookie from request', err);
      res.status(500).send('Failed to get cookie from request');
    }
  }

  const validatedUtmSource =
    utm_source && !validUtmSources[utm_source] ? undefined : utm_source;

  if (ref && !userId) {
    // If there's a ref in the URL and the user isn't signed in,
    // create a temp user id for referral tracking and store the onVisit
    // in the database
    let referredTempUid: string | undefined = req.session.referredTempUid;
    if (!referredTempUid) {
      try {
        referredTempUid = generateUuid();
      } catch (err) {
        console.error('Failed to get temp uid', err);
      }
      req.session.referredTempUid = referredTempUid;

      // Don't bother awaiting, fire-and-forget, no need to hold up execution
      handleFirstVisit(referredTempUid, ref, validatedUtmSource);
    }
  }
  next();
}
