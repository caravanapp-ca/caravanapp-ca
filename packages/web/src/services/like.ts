import axios from 'axios';
import { LikeAction } from '@caravan/buddy-reading-types';

const likeRoute = '/api/likes';

export async function getPostLikes(postId: string) {
  const res = await axios.get(`${likeRoute}/${postId}`);
  return res;
}

export async function modifyPostLike(postId: string, action: LikeAction) {
  const res = await axios.post(`${likeRoute}/${postId}`, {
    action,
  });
  return res;
}
