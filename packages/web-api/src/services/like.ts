import mongoose from 'mongoose';
import { LikesModel, LikesDoc } from '@caravan/buddy-reading-mongo';
import { FilterAutoMongoKeys, Likes } from '@caravan/buddy-reading-types';

export const getPostLikes = async (postId: string) => {
  const likesDoc = await LikesModel.findOne({ postId: postId });
  return likesDoc || undefined;
};

export const createLikesDoc = async (postId: string) => {
  const likesObj: FilterAutoMongoKeys<Likes> = {
    postId,
    likes: [],
    numLikes: 0,
  };
  return LikesModel.create(likesObj);
};
