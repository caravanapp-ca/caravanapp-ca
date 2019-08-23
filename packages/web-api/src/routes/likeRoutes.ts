import express from 'express';
import mongoose from 'mongoose';
import { isAuthenticated } from '../middleware/auth';
import { FilterAutoMongoKeys, Likes } from '@caravan/buddy-reading-types';
import { LikesModel, LikesDoc } from '@caravan/buddy-reading-mongo';

const router = express.Router();

// Like post
router.post('/like/:postId', isAuthenticated, async (req, res, next) => {
  const { postId } = req.params;
  // TODO right now the Transactions code is commented out -- we need to convert our db to a 'replica set' in order
  // to use the Transactions feature
  //const session = await mongoose.startSession();
  //session.startTransaction();
  try {
    const { userId } = req.session;
    const { alreadyLiked } = req.body;
    let result: LikesDoc | undefined;
    if (alreadyLiked) {
      result = await LikesModel.findOneAndUpdate(
        { postId: postId },
        { $inc: { numLikes: -1 }, $pull: { likes: userId } }
      );
    } else {
      result = await LikesModel.findOneAndUpdate(
        { postId: postId },
        { $inc: { numLikes: 1 }, $push: { likes: userId } }
      );
    }
    // const opts = { session, new: true };
    // const result = await LikesModel.findOneAndUpdate(
    //   { _id: postId },
    //   { $set: updatedLikeObj },
    //   opts
    // );
    //await session.commitTransaction();
    //session.endSession();
    return res.status(200).send(result);
  } catch (err) {
    // If an error occurred, abort the whole transaction and undo any changes that might have happened
    //await session.abortTransaction();
    //session.endSession();
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
