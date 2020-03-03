import { UserDoc, PostDoc, PostModel } from '@caravanapp/buddy-reading-mongo';
import { PostUserInfo } from '@caravanapp/buddy-reading-types';

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

export const createPostDoc = async (postDoc: Partial<PostDoc>) => {
  const resultPostDoc = await PostModel.create(postDoc);
  return resultPostDoc;
};
