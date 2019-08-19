import axios from 'axios';
import { Likes, User } from '@caravan/buddy-reading-types';

const likeRoute = '/api/like';

export const getPostLikes = async (postId: string) => {
  const res = await axios.get(`${likeRoute}/likes/${postId}`);
  return res;
};

export async function modifyPostLike(
  user: User,
  postId: string,
  alreadyLiked: boolean,
  likes: Likes
) {
  const res = await axios.post(`${likeRoute}/like/${postId}`, {
    params: {
      user,
      alreadyLiked,
      likes,
    },
  });
  return res;
}
