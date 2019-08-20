import axios from 'axios';

const authRoute = 'api/auth';

export const validateDiscordPermissions = async () => {
  const res = await axios.get(`${authRoute}/discord/validatePermissions`);
  return res;
};
