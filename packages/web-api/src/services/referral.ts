import {
  Referral,
  ReferralAction,
  FilterAutoMongoKeys,
  ReferralSource,
  SameKeysAs,
} from '@caravan/buddy-reading-types';
import { Omit } from 'utility-types';
import ReferralModel from '../models/referral';
import { ReferralDoc } from '../../typings';

export async function handleFirstVisit(
  referredTempUid: string,
  referredById: string,
  utm_source?: ReferralSource
) {
  const newReferral: Omit<
    FilterAutoMongoKeys<Referral>,
    'referredUsers' | 'referralCount'
  > = {
    userId: referredTempUid,
    referredById: referredById,
    actions: [
      {
        action: 'click',
        timestamp: new Date(),
      },
    ],
    source: utm_source,
    referredAndNotJoined: true,
  };
  await new ReferralModel(newReferral).save();
}

export async function createReferralAction(
  referredId: string,
  action: ReferralAction
) {
  const referralDoc = await getReferralDoc(referredId);
  return createReferralActionByDoc(referralDoc, action);
}

export async function createReferralActionByDoc(
  referralDoc: ReferralDoc,
  action: ReferralAction
) {
  if (!referralDoc.referredAndNotJoined) {
    return;
  }
  const date = new Date();
  switch (action) {
    case 'click':
    case 'login':
    case 'onboarded':
      break;
    case 'createClub':
    case 'joinClub':
      const updateReferrerQuery = {
        $inc: {
          referralCount: 1,
        },
        $addToSet: { referredIds: referralDoc.userId },
      };
      ReferralModel.findByIdAndUpdate(
        referralDoc.referredById,
        updateReferrerQuery,
        { new: true }
      );
      referralDoc.referredAndNotJoined = false;
      break;
    default:
      throw new Error(`Unknown referral action ${action}`);
  }
  referralDoc.actions.push({ action, timestamp: date });
  return referralDoc.save();
}

export function getReferralDoc(userId: string) {
  return ReferralModel.findOne({ userId });
}

export function finishReferral() {}
