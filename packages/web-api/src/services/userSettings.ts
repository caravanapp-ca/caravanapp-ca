import UserSettingsModel from '../models/userSettings';
import {
  UserSettings,
  FilterAutoMongoKeys,
} from '@caravan/buddy-reading-types';
import { DEFAULT_EMAIL_SETTINGS } from '../common/globalConstantsAPI';

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
    emailSettings: DEFAULT_EMAIL_SETTINGS,
  };
  const newSettingsModel = new UserSettingsModel(newSettings);
  try {
    const res = await newSettingsModel.save();
    return res;
  } catch (err) {
    return undefined;
  }
};

export const updateUserSettings = async (userId: string, settings: UserSettings) => {
  try{
    const newUserSettings = await UserSettingsModel.findOneAndUpdate({ userId }, settings, { new: true });
    return newUserSettings;
  } catch (err){
    throw new Error(`Failed to update user settings for user ${userId}: ${err}`);
  }
}
