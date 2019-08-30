import { PostUserInfo } from '@caravan/buddy-reading-types';
import { getUser } from './user';

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
    return null;
  }
}
