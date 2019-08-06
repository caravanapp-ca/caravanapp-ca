import UserSettingsModel from '../models/userSettings';
import {
  UserSettings,
  FilterAutoMongoKeys,
} from '@caravan/buddy-reading-types';

export const getUserSettings = async (userId: string) => {
  return UserSettingsModel.findOne({ userId });
};

export const createUserSettings = async (
  settings: FilterAutoMongoKeys<UserSettings>
) => {
  const userSettings = new UserSettingsModel(settings);
  try {
    return userSettings.save();
  } catch (err) {
    throw new Error(`Failed to create user settings ${settings}`);
  }
};
