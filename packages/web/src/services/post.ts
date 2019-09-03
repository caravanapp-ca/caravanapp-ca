import axios from 'axios';
import {
  Services,
  PostContent,
  PostUserInfo,
  PostSearchField,
} from '@caravan/buddy-reading-types';

const postRoute = '/api/posts';

export async function uploadPost(postContent: PostContent) {
  const res = await axios.post<Services.UploadPostResult | null>(postRoute, {
    params: {
      postContent,
    },
  });
  return res;
}

export async function getAllPostsTransformed(
  after?: string,
  pageSize?: number,
  search?: string,
  postSearchField?: PostSearchField
) {
  const res = await axios.get<Services.GetPostsWithAuthorInfoAndLikes>(
    `${postRoute}/withAuthorAndLikesUserInfo`,
    {
      params: {
        after,
        pageSize,
        search,
        postSearchField,
      },
    }
  );
  return res;
}

export async function getFeedViewerUserInfo(userId: string) {
  const res = await axios.get<PostUserInfo | null>(
    `${postRoute}/userInfo/${userId}`
  );
  return res;
}
