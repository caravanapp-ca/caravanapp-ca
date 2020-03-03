import {
  PaletteSet,
  UserPalettes,
  FilterAutoMongoKeys,
} from '@caravanapp/buddy-reading-types';
import { UserPalettesModel } from '@caravanapp/buddy-reading-mongo';

export const getUserPalettes = async (userId: string) => {
  return UserPalettesModel.findOne({ userId });
};

const initUserPalettes = async (
  userPalettes: FilterAutoMongoKeys<UserPalettes>
) => {
  const newUserPalettes = new UserPalettesModel(userPalettes);
  const newUserPalettesRes = await newUserPalettes.save();
  return newUserPalettesRes;
};

export const giveUserPalettes = async (
  userId: string,
  sets?: PaletteSet[],
  individuals?: string[]
) => {
  const update = {
    $addToSet: {
      hasSets: { $each: sets },
      hasIndividuals: { $each: individuals },
    },
  };
  const addSets = sets && sets.length > 0;
  const addIndividuals = individuals && individuals.length > 0;
  if (addSets) {
    console.log(`Giving user ${userId} palette sets: ${sets.join(', ')}.`);
  } else {
    delete update.$addToSet.hasSets;
  }
  if (addIndividuals) {
    console.log(
      `Giving user ${userId} individual palettes: ${individuals.join(', ')}.`
    );
  } else {
    delete update.$addToSet.hasIndividuals;
  }
  if (addSets || addIndividuals) {
    const newUserPalettes = await UserPalettesModel.findOneAndUpdate(
      { userId },
      update,
      { new: true }
    );
    if (newUserPalettes) {
      return newUserPalettes;
    } else {
      console.log(`Initiating new userPalettes document for ${userId}`);
      const newUserPalettes: FilterAutoMongoKeys<UserPalettes> = {
        userId,
        hasSets: sets || [],
        hasIndividuals: individuals || [],
      };
      const newUserPalettesRes = await initUserPalettes(newUserPalettes);
      return newUserPalettesRes;
    }
  }
};
