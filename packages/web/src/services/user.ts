import axios from 'axios';
import { UserDoc } from '@caravan/buddy-reading-types';

const userRoute = '/api/user';

export async function getUser(userId: string) {
  const res = await axios.get<UserDoc | null>(`${userRoute}/${userId}`);
  const userDoc = res.data;
  return userDoc;
}
