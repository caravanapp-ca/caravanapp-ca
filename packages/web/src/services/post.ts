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

export async function editPost(postContent: PostContent, postId: string) {
  const res = await axios.put<Services.UploadPostResult | null>(
    `${postRoute}/${postId}`,
    {
      params: {
        postContent,
      },
    }
  );
  return res;
}

export async function deletePost(postId: string) {
  const res = await axios.delete(`${postRoute}/${postId}`);
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

export async function getPostById(postId: string) {
  const res = await axios.get<Services.GetPostById | null>(
    `${postRoute}/${postId}`
  );
  const post = res.data;
  return post;
}

export async function getFeedViewerUserInfo(userId: string) {
  const res = await axios.get<PostUserInfo | null>(
    `${postRoute}/userInfo/${userId}`
  );
  return res;
}
