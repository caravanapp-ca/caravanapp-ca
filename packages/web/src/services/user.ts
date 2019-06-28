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
