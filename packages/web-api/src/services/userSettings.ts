import {
  FilterAutoMongoKeys,
  UserSettings,
} from '@caravan/buddy-reading-types';
import { DeepPartial } from 'utility-types';
import { DEFAULT_EMAIL_SETTINGS } from '../common/globalConstantsAPI';
import UserSettingsModel from '../models/userSettings';
import { UserSettingsDoc } from '../../typings';

export const getUserSettings = (userId: string) => {
  const userSettingsQuery: DeepPartial<UserSettingsDoc> = {
    userId,
  };
  return UserSettingsModel.findOne(userSettingsQuery);
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
    emailSettings: DEFAULT_EMAIL_SETTINGS,
  };
  const newSettingsModel = new UserSettingsModel(newSettings);
  try {
    const res = await newSettingsModel.save();
    return res;
  } catch (err) {
    console.error(`Failed to save user settings for user ${userId}`, err);
    return undefined;
  }
};

export const updateUserSettings = async (
  userId: string,
  settings: UserSettings
) => {
  try {
    const newUserSettings = await UserSettingsModel.findOneAndUpdate(
      { userId },
      settings,
      { new: true }
    );
    return newUserSettings;
  } catch (err) {
    throw new Error(
      `Failed to update user settings for user ${userId}: ${err}`
    );
  }
};
