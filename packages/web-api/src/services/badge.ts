import { UserBadge } from '@caravan/buddy-reading-types';
import UserModel from '../models/user';
import { BadgeDocInstance } from '../badges/BadgeInstance';

export const getBadges = () => {
  return BadgeDocInstance.getInstance();
};

export const giveUserBadge = async (userId: string, badgeKey: string) => {
  console.log(`Giving user ${userId} badge ${badgeKey}`);
  const newUserBadge: UserBadge = {
    key: badgeKey,
    awardedOn: new Date(),
  };
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $addToSet: {
        badges: newUserBadge,
      },
    },
    {
      new: true,
    }
  );
};

export const getBadge = async (badgeKey: string) => {
  const badgeDoc = await getBadges();
  if (!badgeDoc.badges[badgeKey]) {
    console.error('Badge ${badgeKey} not found.');
    throw new Error(`Badge ${badgeKey} not found.`);
  }
  const badge = badgeDoc.badges[badgeKey];
  return badge;
};
