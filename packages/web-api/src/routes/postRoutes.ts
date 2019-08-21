import express from 'express';
import {
  FilterAutoMongoKeys,
  Post,
  SameKeysAs,
  Services,
  PostUserInfo,
} from '@caravan/buddy-reading-types';
import PostModel from '../models/post';
import { isAuthenticated } from '../middleware/auth';
import { PostDoc } from '../../typings';
import { getUser } from '../services/user';

const router = express.Router();

// Upload post
router.post('/', isAuthenticated, async (req, res, next) => {
  console.log('Posting');
  try {
    const { postContent, userId } = req.body.params;
    if (userId && postContent) {
      const postToUpload: FilterAutoMongoKeys<Post> = {
        authorId: userId,
        content: postContent,
      };
      const post = new PostModel(postToUpload);
      const newPost = await post.save();
      const result = {
        post: newPost,
      };
      return res.status(201).send(result);
    }
  } catch (err) {
    console.log('Failed to upload post', err);
    return next(err);
  }
});

// Get post author info
router.get('/getPostUserInfo/:userId', async (req, res) => {
  const { userId } = req.params;
  const user = await getUser(userId);
  if (user) {
    const userInfo: PostUserInfo = {
      userId,
      name: user.name
        ? user.name
        : user.urlSlug
        ? user.urlSlug
        : 'Caravan User',
      urlSlug: user.urlSlug,
      photoUrl: user.photoUrl,
    };
    return res.status(200).send(userInfo);
  } else {
    console.warn(
      `Unable to get info about the author ${userId} who made a post.`
    );
    return res
      .status(404)
      .send(`Unable to get info about the author ${userId}`);
  }
});

// Get all posts route
router.get('/', async (req, res) => {
  const { after, pageSize } = req.query;
  const query: SameKeysAs<Partial<Post>> = {};
  if (after) {
    query._id = { $lt: after };
  }
  // Calculate number of documents to skip
  const size = Number.parseInt(pageSize || 0);
  const limit = Math.min(Math.max(size, 10), 50);
  let posts: PostDoc[];
  try {
    posts = await PostModel.find(query)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  } catch (err) {
    console.error('Failed to get all posts, ', err);
    res.status(500).send('Failed to get all posts.');
  }
  if (!posts) {
    res.sendStatus(404);
    return;
  }
  let filteredPosts: Services.GetPosts['posts'] = posts
    .map(postDoc => {
      const post: Omit<Post, 'createdAt' | 'updatedAt'> & {
        createdAt: string;
        updatedAt: string;
      } = {
        ...postDoc.toObject(),
        createdAt:
          postDoc.createdAt instanceof Date
            ? postDoc.createdAt.toISOString()
            : postDoc.createdAt,
        updatedAt:
          postDoc.updatedAt instanceof Date
            ? postDoc.updatedAt.toISOString()
            : postDoc.updatedAt,
      };
      return post;
    })
    .filter(p => p !== null);
  if (after) {
    const afterIndex = filteredPosts.findIndex(c => c._id.toString() === after);
    if (afterIndex >= 0) {
      filteredPosts = filteredPosts.slice(afterIndex + 1);
    }
  }
  if (posts.length > limit) {
    posts = posts.slice(0, limit);
  }
  const result: Services.GetPosts = {
    posts: filteredPosts,
  };
  res.status(200).json(result);
});

export default router;
