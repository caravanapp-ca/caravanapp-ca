import express from 'express';
import { isAuthenticated } from '../middleware/auth';
import {
  FilterAutoMongoKeys,
  Post,
  Likes,
  Like,
} from '@caravan/buddy-reading-types';
import LikesModel from '../models/likes';

const router = express.Router();

// Like post
router.post('/like/:postId', isAuthenticated, async (req, res, next) => {
  const { postId } = req.params;
  try {
    const { user, alreadyLiked } = req.body.params;
    const likes = req.body.params.likes as Like[];
    let modifiedLikes: Like[] = [];
    if (alreadyLiked) {
      modifiedLikes = likes.filter(l => l.userId !== user._id);
    } else {
      const newLike: Like = {
        userId: user._id,
        userPhotoUrl: user.photoUrl,
        username: user.name || user.urlSlug || 'Caravan User',
      };
      modifiedLikes = [...modifiedLikes, newLike];
    }
    const updatedLikeObj: FilterAutoMongoKeys<Likes> = {
      likes: modifiedLikes,
    };
    const result = await LikesModel.findByIdAndUpdate(postId, updatedLikeObj, {
      new: true,
    });
    if (result) {
      return res.status(200).send(result);
    } else {
      console.warn(
        `User ${user._id} attempted to modify likes of post id ${postId} but failed.`
      );
      return res.status(404).send(`Unable to find post ${postId}`);
    }
  } catch (err) {
    console.log('Failed to modify post likes', err);
    return next(err);
  }
});

router.get('/likes/:postId', isAuthenticated, async (req, res, next) => {
  const { postId } = req.params;
  const likesObj = await LikesModel.findById(postId);
  return likesObj;
});
