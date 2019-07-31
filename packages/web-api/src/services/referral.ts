import {
  Referral,
  ReferralAction,
  FilterAutoMongoKeys,
  ReferralSource,
} from '@caravan/buddy-reading-types';
import { Omit } from 'utility-types';
import ReferralModel from '../models/referral';
import ReferralTierModel from '../models/referralTier';
import { ReferralDoc } from '../../typings';
import { giveUserBadge } from './badge';
import { giveDiscordRole, sendNewTierDiscordMsg } from './discord';

export const ALLOWED_UTM_SOURCES: { [key in ReferralSource]: boolean } = {
  fb: true,
  tw: true,
  em: true,
  gr: true,
};

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
  const referralDoc = await new ReferralModel(newReferral).save();
  console.log(
    `[Referral] UserId: ${referralDoc.userId}, Referrer: ${referralDoc.referredById}, Action: click`
  );
  return referralDoc;
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
      const userId = referralDoc.referredById;
      const updateReferrerQuery = {
        $inc: {
          referralCount: 1,
        },
        $addToSet: {
          referredUsers: {
            referredUserId: referralDoc.userId,
            timestamp: new Date(),
          },
        },
      };
      let referrerDoc = await ReferralModel.findOneAndUpdate(
        { userId },
        updateReferrerQuery,
        { new: true }
      );
      if (!referrerDoc) {
        const referrerObj: Omit<
          FilterAutoMongoKeys<Referral>,
          'referredById' | 'source'
        > = {
          userId: referralDoc.referredById,
          actions: [],
          referralCount: 1,
          referredUsers: [
            { referredUserId: referralDoc.userId, timestamp: new Date() },
          ],
          referredAndNotJoined: false,
        };
        referrerDoc = await new ReferralModel(referrerObj).save();
      }
      referralDoc.referredAndNotJoined = false;
      // Check if referrer has entered a new referral tier.
      if (referrerDoc.referralCount > 0) {
        const referralTierDoc = await ReferralTierModel.find({});
        if (referralTierDoc.length === 0) {
          console.error('Did not find any referral tiers in database!');
          return;
        }
        const referralTiers = referralTierDoc[0].tiers;
        const newTier = referralTiers.find(
          ut => ut.referralCount === referrerDoc.referralCount
        );
        if (newTier) {
          console.log(
            `User ${referrerDoc.userId} entered referral tier ${newTier.tierNumber}`
          );
          if (newTier.badgeKey) {
            giveUserBadge(referrerDoc.userId, newTier.badgeKey);
          }
          if (newTier.discordRole) {
            giveDiscordRole(referrerDoc.userId, newTier.discordRole);
          }
          sendNewTierDiscordMsg(referrerDoc.userId, newTier);
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

export const getReferralTiersDoc = () => {
  // TODO: Consider adding in-memory storage to reduce DB calls.
  return ReferralTierModel.findOne({});
};

export const getReferralTier = async (tierNum: number) => {
  const referralTierDoc = await getReferralTiersDoc();
  const referralTier = referralTierDoc.tiers.find(
    t => t.tierNumber === tierNum
  );
  if (!referralTier) {
    throw new Error(`Did not find referral tier ${tierNum} in db.`);
  }
  return referralTier;
};
