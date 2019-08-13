import axios from 'axios';
import {
  Services,
  ShelfPost,
  PostType,
  Post,
} from '@caravan/buddy-reading-types';

const postRoute = '/api/post';

export async function uploadPost(postContent: Post, postType: PostType) {
  switch (postType) {
    case 'shelf':
    default:
      const res = await axios.post<Services.CreateShelfPostResult | null>(
        `${postRoute}/shelf`,
        {
          postContent,
        }
      );
      return res;
  }
}
