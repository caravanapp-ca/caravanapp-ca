import axios from 'axios';

const authRoute = '/api/auth';

export async function authorizeDiscordJoin() {
  const result = await axios.post(`${authRoute}/discord/join`);
  return result;
}
