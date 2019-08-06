import axios from 'axios';

const authRoute = 'api/auth';

export const validateDiscordPermissions = async (state: string) => {
  const res = await axios.get(
    `${authRoute}/discord/validatePermissions?state=${state}`
  );
  return res;
};
