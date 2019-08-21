import axios from 'axios';
import { PostUserInfo } from '@caravan/buddy-reading-types';
import { getUser } from './user';

const postRoute = '/api/post';

export async function getPostUserInfo(userId: string) {
  const user = await getUser(userId);
  if (user) {
    const userInfo: PostUserInfo = {
      userId,
      name: user.name
        ? user.name
        : user.urlSlug
        ? user.urlSlug
        : 'Caravan User',
      urlSlug: user.urlSlug,
      photoUrl: user.photoUrl,
    };
    return userInfo;
  } else {
    return undefined;
  }
}
