import { Referral } from '@caravan/buddy-reading-types';
import ReferralModel from '../models/referral';

export async function handleFirstVisit(
  referredTempUid: string,
  referredById: string
) {
  const newReferral: Pick<Referral, 'userId' | 'referredById'> = {
    userId: referredTempUid,
    referredById: referredById,
  };
  const referralDoc = await new ReferralModel(newReferral).save();
}
