import express from 'express';
import { isAuthenticated } from '../middleware/auth';
import {
  FilterAutoMongoKeys,
  Post,
  Likes,
  Like,
} from '@caravan/buddy-reading-types';
import LikesModel from '../models/like';

const router = express.Router();

// Like post
router.post('/like/:postId', isAuthenticated, async (req, res, next) => {
  const { postId } = req.params;
  try {
    const { user, alreadyLiked } = req.body.params;
    const likes = req.body.params.likes as string[];
    let modifiedLikes: string[] = [];
    if (alreadyLiked) {
      modifiedLikes = likes.filter(l => l == user._id);
    } else {
      modifiedLikes = [...modifiedLikes, user._id];
    }
    const updatedLikeObj: FilterAutoMongoKeys<Likes> = {
      likes: modifiedLikes,
    };
    const result = await LikesModel.findOneAndUpdate(
      { postId },
      updatedLikeObj,
      { new: true }
    );
    if (result) {
      return res.status(200).send(result);
    } else {
      console.warn(
        `User ${user._id} attempted to modify likes of post id ${postId} but failed.`
      );
      return res.status(206).send(`Unable to find post ${postId}`);
    }
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
      return res.status(204).send(`Post ${postId} has no likes!`);
    }
  } catch (err) {
    console.log('Failed to get post likes', err);
    return next(err);
  }
});

export default router;
