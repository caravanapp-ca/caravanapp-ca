import axios from 'axios';
import {
  Post,
  FilterAutoMongoKeys,
  Services,
  ActiveFilter,
  PostContent,
} from '@caravan/buddy-reading-types';

const postRoute = '/api/post';

export async function uploadPost(postContent: PostContent, userId: string) {
  const res = await axios.post<Services.UploadPostResult | null>(postRoute, {
    params: {
      postContent,
      userId,
    },
  });
  return res;
}

export async function getAllPosts(after?: string, pageSize?: number) {
  const res = await axios.get<Services.GetPosts>(postRoute, {
    params: {
      after,
      pageSize,
    },
  });
  return res;
}
