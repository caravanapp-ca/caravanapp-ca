import axios from 'axios';
import { Post, FilterAutoMongoKeys } from '@caravan/buddy-reading-types';

const postRoute = '/api/post';

export async function uploadPost(postContent: FilterAutoMongoKeys<Post>) {
  const res = await axios.post(`${postRoute}/post`, {
    postContent,
  });
  return res;
}
