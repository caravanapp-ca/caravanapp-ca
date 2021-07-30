import { LikeAction } from '@caravanapp/types';
import axios from 'axios';
import { API_ORIGIN } from './api';

const likeRoute = `${API_ORIGIN}/api/likes`;

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
