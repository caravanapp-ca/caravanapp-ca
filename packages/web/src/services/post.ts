import axios from 'axios';
import {
  Post,
  FilterAutoMongoKeys,
  Services,
  ActiveFilter,
  PostContent,
  Like,
  Likes,
  PostUserInfo,
} from '@caravan/buddy-reading-types';
import LikeModel from '../../../web-api/src/models/like';
import { getPostLikes } from './like';

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

export async function getPostUserInfo(userId: string) {
  const res = await axios.get<PostUserInfo>(
    `${postRoute}/getPostUserInfo/${userId}`
  );
  return res;
}

export async function getPostAuthorAndLikesUserInfo(
  postId: string,
  userId: string
) {
  let authorInfo: PostUserInfo | undefined = undefined;
  let postLikesUserIds: string[] | undefined = undefined;
  let postLikes: (PostUserInfo | null)[] | undefined = undefined;
  let filteredPostLikes: PostUserInfo[] | undefined = undefined;

  const authorRes = await getPostUserInfo(userId);
  if (authorRes.status >= 200 && authorRes.status < 300) {
    authorInfo = authorRes.data;
  }

  const postLikesRes = await getPostLikes(postId);
  if (postLikesRes.status >= 200 && postLikesRes.status < 300) {
    postLikesUserIds = postLikesRes.data.likes;
    if (postLikesUserIds && postLikesUserIds.length > 0) {
      postLikes = await Promise.all(
        postLikesUserIds.map(async uid => {
          const likeUserInfoRes = await getPostUserInfo(uid);
          if (likeUserInfoRes.status >= 200 && likeUserInfoRes.status < 300) {
            const likeUserInfo: PostUserInfo = likeUserInfoRes.data;
            return likeUserInfo;
          } else {
            return null;
          }
        })
      );
      const nonNullLikesUserInfo = postLikes.filter(pl => pl !== null);
      if (nonNullLikesUserInfo.length > 0) {
        //@ts-ignore
        filteredPostLikes = nonNullLikesUserInfo;
      }
    } else if (postLikesUserIds && postLikesUserIds.length === 0) {
      filteredPostLikes = [];
    }
  }

  if (authorInfo && filteredPostLikes) {
    return { likesUserInfo: filteredPostLikes, authorInfo };
  } else {
    return undefined;
  }
}
