import { LikesModel } from '@caravan/buddy-reading-mongo';
import { FilterAutoMongoKeys, Likes } from '@caravan/buddy-reading-types';

export const getPostLikes = async (postId: string) => {
  const likesDoc = await LikesModel.findOne({ postId: postId });
  if (likesDoc) {
    const likes: string[] = likesDoc.likes;
    const numLikes: number = likesDoc.numLikes;
    return { likes, numLikes };
  } else {
    return undefined;
  }
};

export const createLikesDoc = async (postId: string) => {
  const likesObj: FilterAutoMongoKeys<Likes> = {
    postId,
    likes: [],
    numLikes: 0,
  };
  const likesDoc = new LikesModel(likesObj);
  await likesDoc.save();
  return likesDoc;
};
