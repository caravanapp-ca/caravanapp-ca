import {
  UserSettings,
  FilterAutoMongoKeys,
} from '@caravan/buddy-reading-types';
import { UserSettingsModel } from '@caravan/buddy-reading-mongo';

export const getUserSettings = (userId: string) => {
  return UserSettingsModel.findOne({ userId });
};

export const createUserSettings = (
  settings: FilterAutoMongoKeys<UserSettings>
) => {
  const userSettings = new UserSettingsModel(settings);
  try {
    return userSettings.save();
  } catch (err) {
    throw new Error(`Failed to create user settings ${settings}`);
  }
};
