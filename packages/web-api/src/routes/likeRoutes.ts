import express from 'express';

import { LikesDoc, LikesModel } from '@caravanapp/mongo';

import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

// Like post
router.post('/:postId', isAuthenticated, async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req.session;
  const action: unknown = req.body.action;
  // TODO right now the Transactions code is commented out -- we need to convert our db to a 'replica set' in order
  // to use the Transactions feature
  //const session = await mongoose.startSession();
  //session.startTransaction();
  try {
    let likeArrResult: LikesDoc | undefined;
    if (action === 'unlike') {
      likeArrResult = await LikesModel.findOneAndUpdate(
        { postId },
        { $pull: { likes: userId } }
      );
      if (likeArrResult.likes.includes(userId)) {
        await LikesModel.findOneAndUpdate(
          { postId },
          { $inc: { numLikes: -1 } }
        );
      }
    } else if (action === 'like') {
      likeArrResult = await LikesModel.findOneAndUpdate(
        { postId },
        { $addToSet: { likes: userId } }
      );
      if (!likeArrResult.likes.includes(userId)) {
        await LikesModel.findOneAndUpdate(
          { postId },
          { $inc: { numLikes: 1 } }
        );
      }
    } else {
      return res.status(400).send('Invalid action');
    }
    // const opts = { session, new: true };
    // const result = await LikesModel.findOneAndUpdate(
    //   { _id: postId },
    //   { $set: updatedLikeObj },
    //   opts
    // );
    //await session.commitTransaction();
    //session.endSession();
    return res.status(200).send(`Successfully ${action}d`);
  } catch (err) {
    // If an error occurred, abort the whole transaction and undo any changes that might have happened
    //await session.abortTransaction();
    //session.endSession();
    console.log('Failed to modify post likes', err);
    return next(err);
  }
});

router.get('/:postId', async (req, res, next) => {
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
