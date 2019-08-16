import axios from 'axios';
import {
  Post,
  FilterAutoMongoKeys,
  Services,
} from '@caravan/buddy-reading-types';

const postRoute = '/api/post';

export async function uploadPost(postContent: FilterAutoMongoKeys<Post>) {
  const res = await axios.post<Services.UploadPostResult | null>(
    `${postRoute}/post`,
    {
      postContent,
    }
  );
  return res;
}
