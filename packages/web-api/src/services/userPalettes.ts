import UserPalettesModel from '../models/userPalettes';

export const getUserPalettes = async (userId: string) => {
  return UserPalettesModel.findOne({ userId });
};
