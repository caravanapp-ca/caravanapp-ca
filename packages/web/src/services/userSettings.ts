import axios from 'axios';
import { UserSettings } from '@caravan/buddy-reading-types';
const userSettingsRoute = '/api/userSettings';

export const getMySettings = async () => {
  const res = await axios.get<UserSettings>(`${userSettingsRoute}/@me`);
  return res;
};

export const updateMySettings = async (settings: UserSettings) => {
  const res = await axios.put<UserSettings>(`${userSettingsRoute}/@me`, {
    settings
  });
  return res;
}
