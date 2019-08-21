import express from 'express';
import {
  FilterAutoMongoKeys,
  Post,
  SameKeysAs,
  Services,
  PostUserInfo,
  PostWithAuthorInfoAndLikes,
} from '@caravan/buddy-reading-types';
import PostModel from '../models/post';
import { isAuthenticated } from '../middleware/auth';
import { PostDoc } from '../../typings';
import { getUser } from '../services/user';
import { getPostLikes } from '../services/like';
import { getPostUserInfo } from '../services/post';

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
  const postUserInfo = await getPostUserInfo(userId);
  if (postUserInfo) {
    return res.status(200).send(postUserInfo);
  } else {
    return res.status(404).send('Feed viewer user doc not found');
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

// Get all posts with author and like users info
router.get('/withAuthorAndLikesUserInfo', async (req, res) => {
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
  const postsWithAuthorAndLikesUserInfo: (PostWithAuthorInfoAndLikes | null)[] = await Promise.all(
    filteredPosts.map(async p => {
      let filteredLikesArr: PostUserInfo[] = [];
      const postLikes = await getPostLikes(p._id);
      if (postLikes && postLikes.length > 0) {
        const likesObjArr = await Promise.all(
          postLikes.map(async luid => {
            const likeUserInfo = await getPostUserInfo(luid);
            if (likeUserInfo) {
              return likeUserInfo;
            } else {
              return null;
            }
          })
        );
        filteredLikesArr = likesObjArr.filter(l => l !== null);
      }
      const authorInfo = await getPostUserInfo(p.authorId);
      if (authorInfo) {
        return { post: p, authorInfo, likes: filteredLikesArr };
      } else {
        return null;
      }
    })
  );
  const filteredPostsWithAuthorAndLikesUserInfo = postsWithAuthorAndLikesUserInfo.filter(
    p => p !== null
  );
  const result: Services.GetPostsWithAuthorInfoAndLikes = {
    posts: filteredPostsWithAuthorAndLikesUserInfo,
  };
  res.status(200).json(result);
});

export default router;
