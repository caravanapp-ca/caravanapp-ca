import axios from 'axios';
import {
  Services,
  PostContent,
  PostUserInfo,
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

export async function getAllPostsTransformed(
  after?: string,
  pageSize?: number
) {
  const res = await axios.get<Services.GetPostsWithAuthorInfoAndLikes>(
    `${postRoute}/withAuthorAndLikesUserInfo`,
    {
      params: {
        after,
        pageSize,
      },
    }
  );
  return res;
}

export async function getFeedViewerUserInfo(userId: string) {
  const res = await axios.get<PostUserInfo | null>(
    `${postRoute}/getPostUserInfo/${userId}`
  );
  return res;
}
