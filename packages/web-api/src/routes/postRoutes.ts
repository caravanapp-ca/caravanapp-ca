import express from 'express';
import Fuse from 'fuse.js';
import {
  FilterAutoMongoKeys,
  Post,
  SameKeysAs,
  Services,
  PostUserInfo,
  PostWithAuthorInfoAndLikes,
  PostContent,
} from '@caravan/buddy-reading-types';
import { PostModel, PostDoc } from '@caravan/buddy-reading-mongo';
import { isAuthenticated } from '../middleware/auth';
import { getPostLikes, createLikesDoc } from '../services/like';
import { getPostUserInfo } from '../services/post';

const router = express.Router();

function instanceOfPostContent(object: any): object is PostContent {
  return 'postType' in object;
}

// Upload post
router.post('/', isAuthenticated, async (req, res, next) => {
  console.log('Posting');
  try {
    const { postContent } = req.body.params;
    const { userId } = req.session;
    if (userId && instanceOfPostContent(postContent)) {
      const postToUpload: FilterAutoMongoKeys<Post> = {
        authorId: userId,
        content: postContent,
      };
      const post = new PostModel(postToUpload);
      const newPost = await post.save();
      const result = {
        post: newPost,
      };
      await createLikesDoc(newPost._id.toHexString());
      return res.status(201).send(result);
    }
  } catch (err) {
    console.log('Failed to upload post', err);
    return next(err);
  }
});

// Get post author info
router.get('/userInfo/:userId', async (req, res) => {
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
  let filteredPosts: Services.GetPosts['posts'] = posts.map(postDoc => {
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
  });
  if (after) {
    const afterIndex = filteredPosts.findIndex(c => c._id === after);
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
  const { after, pageSize, search, postSearchField } = req.query;
  const query: SameKeysAs<Partial<Post>> = {};
  if ((!search || search.length === 0) && after) {
    query._id = { $lt: after };
  }
  // Calculate number of documents to skip
  const size = Number.parseInt(pageSize || 0);
  const limit = Math.min(Math.max(size, 10), 50);
  let posts: PostDoc[];
  try {
    if (search && search.length > 0) {
      posts = await PostModel.find(query)
        .sort({ createdAt: -1 })
        .exec();
    } else {
      posts = await PostModel.find(query)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();
    }
  } catch (err) {
    console.error('Failed to get all posts, ', err);
    res.status(500).send('Failed to get all posts.');
    return;
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
      if (post.content.postType === 'shelf') {
        return post;
      } else {
        return null;
      }
    })
    .filter(p => p !== null);
  if ((search && search.length) > 0) {
    let fuseSearchKey: string;
    let fuseOptions: Fuse.FuseOptions<Services.GetPosts['posts']> = {};
    switch (postSearchField) {
      case 'bookTitle':
      default:
        fuseSearchKey = 'content.shelf.title';
        fuseOptions = {
          minMatchCharLength: 2,
          caseSensitive: false,
          shouldSort: true,
          threshold: 0.4,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          // TODO: Typescript doesn't like the use of keys here.
          // @ts-ignore
          keys: [fuseSearchKey],
        };
        break;
      case 'bookAuthor':
        fuseSearchKey = 'content.shelf.author';
        fuseOptions = {
          minMatchCharLength: 2,
          caseSensitive: false,
          shouldSort: true,
          threshold: 0.4,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          // TODO: Typescript doesn't like the use of keys here.
          // @ts-ignore
          keys: [fuseSearchKey],
        };
        break;
      case 'postTitle':
        fuseSearchKey = 'content.title';
        fuseOptions = {
          // TODO: Typescript doesn't like the use of keys here.
          // @ts-ignore
          keys: [fuseSearchKey],
        };
        break;
    }
    const fuse = new Fuse(filteredPosts, fuseOptions);
    filteredPosts = fuse.search(search);
  }
  if (after) {
    const afterIndex = filteredPosts.findIndex(c => c._id === after);
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
      let numLikes: number = 0;
      if (postLikes && postLikes.numLikes && postLikes.numLikes > 0) {
        numLikes = postLikes.numLikes;
        const slicedLikes = postLikes.likes.slice(0, 10);
        const likesObjArr = await Promise.all(
          slicedLikes.map(async luid => {
            const likeUserInfo = await getPostUserInfo(luid.toString());
            return likeUserInfo || null;
          })
        );
        filteredLikesArr = likesObjArr.filter(l => l !== null);
      }
      const authorInfo = await getPostUserInfo(p.authorId);
      if (authorInfo) {
        return {
          post: p,
          authorInfo,
          likes: filteredLikesArr,
          likeUserIds: postLikes.likes,
          numLikes,
        };
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
