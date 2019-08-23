import axios from 'axios';
import { Likes, User, FilterAutoMongoKeys } from '@caravan/buddy-reading-types';

const likeRoute = '/api/like';

export async function getPostLikes(postId: string) {
  const res = await axios.get(`${likeRoute}/likes/${postId}`);
  return res;
}

export async function modifyPostLike(postId: string, alreadyLiked: boolean) {
  const res = await axios.post(`${likeRoute}/like/${postId}`, {
    alreadyLiked,
  });
  return res;
}
