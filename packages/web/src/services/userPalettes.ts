import { UserPalettes } from '@caravanapp/types';
import axios from 'axios';
import { API_ORIGIN } from './api';

const userPalettesRoute = `${API_ORIGIN}/api/userPalettes`;

export async function getUserPalettes(userId: string) {
  const res = await axios.get<{ userPalettes: UserPalettes | null }>(
    `${userPalettesRoute}/${userId}`
  );
  return res;
}
