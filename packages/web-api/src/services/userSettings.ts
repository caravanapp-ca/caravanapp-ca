import UserSettingsModel from '../models/userSettings';
import {
  UserSettings,
  FilterAutoMongoKeys,
} from '@caravan/buddy-reading-types';

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

export const initSettings = async (userId: string) => {
  const existingUserSettings = await getUserSettings(userId);
  if (existingUserSettings) {
    console.error(
      `Attempted to init user settings, but user settings already exist for user ${userId}!`
    );
    return existingUserSettings;
  }
  const newSettings: FilterAutoMongoKeys<UserSettings> = {
    userId,
    emailSettings: {
      reminders: true,
      recs: true,
      updates: true,
    },
  };
  const newSettingsModel = new UserSettingsModel(newSettings);
  try {
    const res = await newSettingsModel.save();
    return res;
  } catch (err) {
    return undefined;
  }
};
