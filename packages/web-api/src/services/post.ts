import { UserDoc } from '@caravan/buddy-reading-mongo';
import { PostUserInfo } from '@caravan/buddy-reading-types';
import { getUser } from './user';

export function mapPostUserInfo(userDoc: UserDoc) {
  if (userDoc) {
    const userInfo: PostUserInfo = {
      userId: userDoc.id,
      name: userDoc.name
        ? userDoc.name
        : userDoc.urlSlug
        ? userDoc.urlSlug
        : 'Caravan User',
      urlSlug: userDoc.urlSlug,
      photoUrl: userDoc.photoUrl,
      discordId: userDoc.discordId,
    };
    return userInfo;
  } else {
    return null;
  }
}
