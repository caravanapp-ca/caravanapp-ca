import {
  Referral,
  ReferralAction,
  FilterAutoMongoKeys,
  ReferralSource,
  SameKeysAs,
} from '@caravan/buddy-reading-types';
import { Omit } from 'utility-types';
import UserModel from '../models/user';
import ReferralModel from '../models/referral';
import ReferralTierModel from '../models/referralTier';
import { ReferralDoc } from '../../typings';
import { giveUserBadge } from './badge';
import { giveDiscordRole } from './discord';

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
      const referrer = await ReferralModel.findByIdAndUpdate(
        referralDoc.referredById,
        updateReferrerQuery,
        { new: true }
      );
      // TODO: Check if referrer has entered a new referral tier.
      if (referrer.referralCount > 0) {
        const referralTierDoc = await ReferralTierModel.find();
        if (referralTierDoc.length === 0) {
          console.error('Did not find any referral tiers in database!');
          return;
        }
        const referralTiers = referralTierDoc[0].tiers;
        const newTier = referralTiers.find(
          ut => ut.referralCount === referrer.referralCount
        );
        if (newTier) {
          console.log(
            `User ${referrer.userId} entered referral tier ${newTier.tierNumber}`
          );
          if (newTier.badgeKey) {
            giveUserBadge(referrer.userId, newTier.badgeKey);
          }
          if (newTier.discordRole) {
            giveDiscordRole(referrer.userId, newTier.discordRole);
          }
        }
      }
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
