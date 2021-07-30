import axios from 'axios';
import { API_ORIGIN } from './api';

const authRoute = `${API_ORIGIN}/api/auth`;

export const validateDiscordPermissions = async () => {
  const res = await axios.get(`${authRoute}/discord/validatePermissions`);
  return res;
};
