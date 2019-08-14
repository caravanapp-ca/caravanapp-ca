import express from 'express';
import { FilterAutoMongoKeys, Post } from '@caravan/buddy-reading-types';
import PostModel from '../models/post';
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

// Upload post
router.post('/post', isAuthenticated, async (req, res, next) => {
  try {
    const postContent: FilterAutoMongoKeys<Post> = req.body.postContent;
    const post = new PostModel(postContent);
    const newPost = await post.save();
    const result = {
      post: newPost,
    };
    return res.status(201).send(result);
  } catch (err) {
    console.log('Failed to upload post', err);
    return next(err);
  }
});

export default router;
