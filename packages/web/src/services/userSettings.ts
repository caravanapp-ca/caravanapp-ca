import { UserSettings } from '@caravanapp/types';
import axios from 'axios';
import { API_ORIGIN } from './api';

const userSettingsRoute = `${API_ORIGIN}/api/userSettings`;

export const getMySettings = async () => {
  const res = await axios.get<UserSettings>(`${userSettingsRoute}/@me`);
  return res;
};

export const updateMySettings = async (settings: UserSettings) => {
  const res = await axios.put<UserSettings>(`${userSettingsRoute}/@me`, {
    settings,
  });
  return res;
};
