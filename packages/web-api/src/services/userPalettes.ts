import { UserPalettesModel } from "@caravan/buddy-reading-mongo";

export const getUserPalettes = async (userId: string) => {
  return UserPalettesModel.findOne({ userId });
};
