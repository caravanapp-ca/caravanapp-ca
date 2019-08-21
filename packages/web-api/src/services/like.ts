import LikesModel from '../models/like';

export const getPostLikes = async (postId: string) => {
  const likesDoc = await LikesModel.findById(postId);
  if (likesDoc) {
    const likes: string[] = likesDoc.likes;
    return likes;
  } else {
    return undefined;
  }
};
