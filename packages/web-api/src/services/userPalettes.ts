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

export const initUserPalettes = async (
  userPalettes: FilterAutoMongoKeys<UserPalettes>
) => {
  try {
    const newUserPalettes = new UserPalettesModel(userPalettes);
    newUserPalettes._id = new mongoose.Types.ObjectId();
    const newUserPalettesRes = await newUserPalettes.save();
    return newUserPalettesRes;
  } catch (err) {
    console.error(
      `Error initiating user palettes for user ${userPalettes.userId}: ${err}`
    );
    return;
  }
};

export const giveUserPalettes = async (
  userId: string,
  sets?: PaletteSet[],
  individuals?: string[]
) => {
  const addSets = sets && sets.length > 0;
  const addIndividuals = individuals && individuals.length > 0;
  if (addSets) {
    console.log(`Giving user ${userId} palette sets: ${sets.join(', ')}.`);
  }
  if (individuals && individuals.length > 0) {
    console.log(
      `Giving user ${userId} individual palettes: ${individuals.join(', ')}.`
    );
  }
  const existingUserPalettes = await getUserPalettes(userId);
  if (existingUserPalettes) {
    let madeChanges = false;
    if (addSets) {
      sets.forEach(s => {
        if (!existingUserPalettes.hasSets.includes(s)) {
          existingUserPalettes.hasSets.push(s);
        }
      });
      madeChanges = true;
    }
    if (addIndividuals) {
      individuals.forEach(i => {
        if (!existingUserPalettes.hasIndividuals.includes(i)) {
          existingUserPalettes.hasIndividuals.push(i);
        }
      });
      madeChanges = true;
    }
    if (madeChanges) {
      try {
        existingUserPalettes.save();
      } catch (err) {
        console.error(`Error updating userPalettes for user ${userId}`);
        return;
      }
    }
    return existingUserPalettes;
  } else {
    console.log(`Initiating new userPalettes document for ${userId}`);
    const newUserPalettes: FilterAutoMongoKeys<UserPalettes> = {
      userId,
      hasSets: sets,
      hasIndividuals: individuals,
    };
    const newUserPalettesRes = await initUserPalettes(newUserPalettes);
    return newUserPalettesRes;
  }
};
