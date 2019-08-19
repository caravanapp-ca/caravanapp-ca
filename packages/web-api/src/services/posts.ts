import PostsModel from '../models/post';

export const getPostLikes = async (postId: string) => {
  const likes = await PostsModel.findById(postId);
  return likes;
};
