import UserModel from '../models/user';
import { UserBadge } from '@caravan/buddy-reading-types';

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
