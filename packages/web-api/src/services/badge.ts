import UserModel from '../models/user';
import BadgeModel from '../models/badge';
import { UserBadge } from '@caravan/buddy-reading-types';
import { BadgeDoc } from '../../typings';

export const getAllBadges = async () => {
  let badges: BadgeDoc[];
  try{
    badges = await BadgeModel.find({});
  } catch (err){
    throw new Error(`Error retrieving badges ${err}`);
  }
  if(!badges || badges.length === 0){
    throw new Error('Did not find any badges in database!');
  }
  return badges;
}

export const giveUserBadge = async (userId: string, badgeKey: string) => {
  console.log(`Giving user ${userId} badge ${badgeKey}`);
  const newUserBadge: UserBadge = {
    key: badgeKey,
    awardedOn: new Date(),
  };
  const newUser = await UserModel.findByIdAndUpdate(
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

export const getBadge = async(badgeKey: string) => {
  const badges = await getAllBadges();
  if(!badges[0].badges[badgeKey]){
    throw new Error(`Badge ${badgeKey} not found.`);
  }
  const badge = badges[0].badges[badgeKey];
  return badge;
}
