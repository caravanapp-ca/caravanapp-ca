import express from 'express';
import mongoose from 'mongoose';
import { isAuthenticated } from '../middleware/auth';
import {
  FilterAutoMongoKeys,
  Post,
  Likes,
  Like,
} from '@caravan/buddy-reading-types';
import LikesModel from '../models/like';
import post from '../models/post';

const router = express.Router();

// Like post
router.post('/like/:postId', isAuthenticated, async (req, res, next) => {
  const { postId } = req.params;
  try {
    const { user, alreadyLiked } = req.body.params;
    const likes: string[] = req.body.params.likesUserIds;
    const updatedLikeObj: FilterAutoMongoKeys<Likes> = {
      likes,
    };
    // const session = await mongoose.startSession();
    // session.startTransaction();
    // const opts = { session };
    // const A = await User.findOneAndUpdate(
    //   { _id: userId },
    //   { $inc: { wallet: amount } },
    //   opts
    // );

    // const B = await Transaction({
    //   usersId: userId,
    //   amount: amount,
    //   type: 'credit',
    // }).save(opts);

    // await session.commitTransaction();
    // session.endSession();
    const tryThis = await LikesModel.findOneAndUpdate(
      { _id: postId },
      { $set: updatedLikeObj },
      { upsert: true }
    );
    // const existingLikesDoc = await LikesModel.findOne({ _id: postId });
    // if (existingLikesDoc) {
    //   const result = await LikesModel.findOneAndUpdate(
    //     { _id: postId },
    //     updatedLikeObj,
    //     { new: true }
    //   );
    //   return res.status(200).send(result);
    // } else {
    //   try {
    //     const newLikesObj: FilterAutoMongoKeys<Likes> = {
    //       likes: modifiedLikes,
    //     };
    //     const newLikesObjSaved = await new LikesModel(newLikesObj).save();
    //     return res.status(200).send(newLikesObjSaved);
    //   } catch (err) {
    //     console.log('Failed to modify post likes', err);
    //     return next(err);
    //   }
    // }
  } catch (err) {
    console.log('Failed to modify post likes', err);
    return next(err);
  }
});

router.get('/likes/:postId', isAuthenticated, async (req, res, next) => {
  const { postId } = req.params;
  try {
    const result = await LikesModel.findById(postId);
    if (result) {
      return res.status(200).send(result);
    } else {
      console.warn(`Post ${postId} has no likes.`);
      return res.status(204).send([]);
    }
  } catch (err) {
    console.log('Failed to get post likes', err);
    return next(err);
  }
});

export default router;
