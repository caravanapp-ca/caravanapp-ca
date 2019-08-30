import axios from 'axios';
import { Likes, User, FilterAutoMongoKeys } from '@caravan/buddy-reading-types';

const likeRoute = '/api/likes';

export async function getPostLikes(postId: string) {
  const res = await axios.get(`${likeRoute}/${postId}`);
  return res;
}

export async function modifyPostLike(postId: string, alreadyLiked: boolean) {
  const res = await axios.post(`${likeRoute}/${postId}`, {
    alreadyLiked,
  });
  return res;
}
