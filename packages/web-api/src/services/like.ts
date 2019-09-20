import mongoose from 'mongoose';
import {
  FilterMongooseDocKeys,
  LikesModel,
  LikesDoc,
} from '@caravan/buddy-reading-mongo';

export const getPostLikes = async (postId: mongoose.Types.ObjectId) => {
  const likesDoc = await LikesModel.findOne({ postId: postId });
  return likesDoc;
};

export const getPostsLikes = async (postIds: mongoose.Types.ObjectId[]) => {
  const likesDocs = await LikesModel.find({
    postId: { $in: postIds },
  });
  return likesDocs;
};

export const createLikesDoc = async (postId: mongoose.Types.ObjectId) => {
  const likesObj: FilterMongooseDocKeys<LikesDoc> = {
    postId,
    likes: [],
    numLikes: 0,
  };
  return LikesModel.create(likesObj);
};

export async function deleteLikesDocByPostId(postId: string) {
  const likesDoc = await LikesModel.findOneAndDelete({ postId });
  return likesDoc || undefined;
}
