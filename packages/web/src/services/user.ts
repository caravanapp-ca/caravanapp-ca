import axios from 'axios';
import { User } from '@caravan/buddy-reading-types';

const userRoute = '/api/user';

export async function getUser(userId: string) {
  const res = await axios.get<User | null>(`${userRoute}/${userId}`);
  const user = res.data;
  return user;
}

export async function getUsersById(userIds: Array<String>) {
  const res = await axios.post<Array<User> | null>(`${userRoute}/users`, {
    userIds: userIds,
  });
  const users = res.data;
  return users;
}

export async function isSlugAvailable(slug: string) {
  try {
    const res = await axios.post<string>(`${userRoute}/${slug}/available`);
    if (res.status === 200) {
      return { available: true, err: null };
    } else {
      return { available: false, err: null };
    }
  } catch (err) {
    const { response } = err;
    if (response.status === 409) {
      return { available: false, err: null };
    } else {
      return { available: false, err: err.message };
    }
  }
}
