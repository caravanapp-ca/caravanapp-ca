import UserModel from '../models/user';

export const giveUserBadge = async (userId: string, badgeKey: string) => {
  console.log(`Giving user ${userId} badge ${badgeKey}`);
  const newUser = await UserModel.findByIdAndUpdate(
    userId,
    {
      badges: {
        $push: {
          key: badgeKey,
        },
      },
    },
    {
      new: true,
    }
  );
};
