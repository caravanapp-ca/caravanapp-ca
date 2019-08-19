import mongoose from 'mongoose';
import UserPalettesModel from '../models/userPalettes';
import {
  PaletteSet,
  UserPalettes,
  FilterAutoMongoKeys,
} from '@caravan/buddy-reading-types';

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
  const update: any = {};
  const addSets = sets && sets.length > 0;
  const addIndividuals = individuals && individuals.length > 0;
  if (addSets) {
    console.log(`Giving user ${userId} palette sets: ${sets.join(', ')}.`);
    update.$addToSet.hasSets = { $each: sets };
  }
  if (addIndividuals) {
    console.log(
      `Giving user ${userId} individual palettes: ${individuals.join(', ')}.`
    );
    update.$addToSet.hasIndividuals = { $each: individuals };
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
