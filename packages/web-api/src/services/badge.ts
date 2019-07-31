import UserModel from '../models/user';
import BadgeModel from '../models/badge';
import { UserBadge } from '@caravan/buddy-reading-types';
import { BadgeDoc } from '../../typings';

export const getBadges = async () => {
  let badges: BadgeDoc;
  try {
    badges = await BadgeModel.findOne();
  } catch (err) {
    console.error(`Error retrieving badges ${err}`);
    throw new Error(`Error retrieving badges ${err}`);
  }
  if (!badges) {
    console.error('Did not find any badges in database!');
    throw new Error('Did not find any badges in database!');
  }
  return badges;
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
