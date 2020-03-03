import axios from 'axios';
import { UserPalettes } from '@caravanapp/buddy-reading-types';

const userPalettesRoute = '/api/userPalettes';

export async function getUserPalettes(userId: string) {
  const res = await axios.get<{ userPalettes: UserPalettes | null }>(
    `${userPalettesRoute}/${userId}`
  );
  return res;
}
