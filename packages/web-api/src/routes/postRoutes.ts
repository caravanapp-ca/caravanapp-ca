import express from 'express';
import Fuse from 'fuse.js';
import mongoose from 'mongoose';
import {
  Post,
  PostWithAuthorInfoAndLikes,
  SameKeysAs,
  Services,
} from '@caravan/buddy-reading-types';
import {
  PostModel,
  PostDoc,
  UserDoc,
  FilterMongooseDocKeys,
} from '@caravan/buddy-reading-mongo';
import { isAuthenticated } from '../middleware/auth';
import {
  getPostLikes,
  createLikesDoc,
  deleteLikesDocByPostId,
  getPostsLikes,
} from '../services/like';
import { createPostDoc, mapPostUserInfo } from '../services/post';
import { getUser, getUsersByUserIds } from '../services/user';

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validPostContent(object: any) {
  return 'postType' in object;
}

router.post('/', isAuthenticated, async (req, res, next) => {
  const { postContent } = req.body.params;
  const userId: string = req.session.userId;
  if (!validPostContent(postContent)) {
    res.status(422).send(`Invalid post content: ${postContent}`);
    return;
  }
  console.log(`Creating post { userId: ${userId} }`);
  const postToUpload: Partial<PostDoc> = {
    authorId: userId,
    content: postContent,
  };
  let postDoc: PostDoc;
  try {
    postDoc = await createPostDoc(postToUpload);
    console.log(`Post created { userId: ${userId}, postId: ${postDoc.id} }`);
    const likesDoc = await createLikesDoc(postDoc.id);
    console.log(
      `Like doc created { userId: ${userId}, postId: ${likesDoc.id} }`
    );
    const result = {
      post: postDoc,
    };
    return res.status(201).send(result);
  } catch (err) {
    console.error(
      `Failed to upload post { user: ${userId}, postId: ${postDoc &&
        postDoc._id} }`,
      err
    );
    return next(err);
  }
});

// Edit post
router.put('/:id', isAuthenticated, async (req, res) => {
  const { postContent } = req.body.params;
  const { userId } = req.session;
  const postId = req.params.id;
  console.log(`Editing ${postId}`);
  if (userId && validPostContent(postContent)) {
    const postToUpload: Partial<PostDoc> = {
      authorId: userId,
      content: postContent,
    };
    try {
      const editPostResult: PostDoc = await PostModel.findByIdAndUpdate(
        postId,
        postToUpload,
        {
          new: true,
        }
      );
      if (editPostResult) {
        return res.status(200).send(editPostResult);
      } else {
        console.warn(
          `User ${userId} attempted to edit post ${postId} but the post was not found.`
        );
        return res.status(404).send(`Unable to find post ${postId}`);
      }
    } catch (err) {
      console.error('Failed to save post data', err);
      return res.status(400).send('Failed to save post data');
    }
  }
});

// Delete a post
router.delete('/:postId', isAuthenticated, async (req, res) => {
  const { userId } = req.session;
  const { postId } = req.params;

  let postDoc: PostDoc;
  try {
    postDoc = await PostModel.findById(postId);
  } catch (err) {
    return res.status(400).send(`Could not find post ${postId}`);
  }
  if (userId === postDoc.authorId) {
    try {
      postDoc = await postDoc.remove();
      console.log(`Deleted post ${postDoc.id} by user ${userId}`);
    } catch (err) {
      console.log(`User ${userId} failed to delete post ${postDoc.id}`);
      return res.status(500).send(err);
    }
    try {
      const likesDoc = await deleteLikesDocByPostId(postId);
      console.log(`Deleted post ${postDoc.id} and corresponding likes doc`);
      return res
        .status(204)
        .send(
          `Deleted post ${postDoc.id} and corresponding likes doc ${likesDoc.id}`
        );
    } catch {
      console.log(
        `Deleted post ${postDoc.id} but could not delete corresponding likes doc`
      );
      return res
        .status(204)
        .send(
          `Deleted post ${postDoc.id} but could not delete corresponding likes doc`
        );
    }
  } else {
    console.log(
      `User ${userId} failed to authenticate to delete post ${postDoc.id}, actually created by user ${postDoc.authorId}`
    );
    return res
      .status(401)
      .send("You don't have permission to delete this post.");
  }
});

// Get post author info
router.get('/userInfo/:userId', async (req, res) => {
  const { userId } = req.params;
  const userDoc = await getUser(userId);
  const postUserInfo = mapPostUserInfo(userDoc);
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

// Get a post with its author and likes user info
router.get('/:postId/withAuthorAndLikesUserInfo', async (req, res, next) => {
  const { postId } = req.params;
  try {
    const postDoc = await PostModel.findById(postId);
    if (!postDoc) {
      res.sendStatus(404);
      return;
    }
    const filteredPost: FilterMongooseDocKeys<PostDoc> & {
      _id: mongoose.Types.ObjectId;
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
    const postsLikesDoc = await getPostLikes(postId);

    const [likeUserDocs, authorUserDoc] = await Promise.all([
      getUsersByUserIds(postsLikesDoc.likes.slice(0, 10)),
      getUser(filteredPost.authorId),
    ]);

    const likeUserDocsMap = new Map<string, UserDoc>();
    likeUserDocs.forEach(d => likeUserDocsMap.set(d.id, d));

    const post = {
      ...filteredPost,
      _id: filteredPost._id.toHexString(),
    };
    const authorInfo = mapPostUserInfo(authorUserDoc);
    const likeUserIds = likeUserDocs.map(lud => lud._id.toHexString());
    const likesUserDocs = likeUserIds.map(uid => likeUserDocsMap.get(uid));
    const likes = likesUserDocs.map(mapPostUserInfo);
    const { numLikes } = postsLikesDoc;

    const result: Services.GetPostWithAuthorInfoAndLikes = {
      authorInfo,
      likeUserIds,
      post,
      numLikes,
      likes,
    };
    res.status(200).json(result);
  } catch (err) {
    if (err.name) {
      switch (err.name) {
        case 'CastError':
          res.sendStatus(404);
          return;
        default:
          break;
      }
    }
    console.log(
      `Failed to get post ${postId} with its author and likes user info`,
      err
    );
    return next(err);
  }
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
  let filteredPosts = posts
    .map(postDoc => {
      const post: FilterMongooseDocKeys<PostDoc> & {
        _id: mongoose.Types.ObjectId;
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
      case 'bookTitle':
      // Fall-through.
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

  const filteredPostsIds = filteredPosts.map(p => p._id);
  const postsLikesDocs = await getPostsLikes(filteredPostsIds);
  // We will need access to the subset of likes a few times, so save them here
  const usableLikesMap = new Map<string, mongoose.Types.ObjectId[]>();
  postsLikesDocs.forEach(p => {
    // Get up to 10 user ids that liked each post
    usableLikesMap.set(p.postId.toHexString(), p.likes.slice(0, 10));
  });

  // Get all of the userIds for users that we want to get like info for from the database,
  // removing duplicates using the Set structure.
  const postLikesUserIds = [
    // De-duplicates the user ids by using a Set, which is O(n) instead of O(n)^2
    ...new Set(
      // The flatMap() method first maps each element using a mapping function, then flattens the result into a new arr.
      postsLikesDocs.flatMap(
        // Get up to 10 user ids that liked each post
        p => usableLikesMap.get(p.postId.toHexString())
      )
    ),
  ];

  // Gets unique author ids across all posts so that the DB call only requests unique users.
  const authorIds = [...new Set(filteredPosts.map(p => p.authorId))].map(
    id => new mongoose.Types.ObjectId(id)
  );

  const [likeUserDocs, authorUserDocs] = await Promise.all([
    getUsersByUserIds(postLikesUserIds),
    getUsersByUserIds(authorIds),
  ]);

  // For quicker merging, use Maps.
  const likeUserDocsMap = new Map<string, UserDoc>();
  const authorUserDocsMap = new Map<string, UserDoc>();
  likeUserDocs.forEach(d => likeUserDocsMap.set(d.id, d));
  authorUserDocs.forEach(d => authorUserDocsMap.set(d.id, d));

  const postsInfo = filteredPosts.map(postWithObjId => {
    const post = {
      ...postWithObjId,
      _id: postWithObjId._id.toHexString(),
    };
    const authorUserDoc = authorUserDocsMap.get(post.authorId);
    const authorInfo = mapPostUserInfo(authorUserDoc);
    const likeUserIds = usableLikesMap
      .get(post._id)
      .map(uid => uid.toHexString());
    const likesUserDocs = likeUserIds.map(uid => likeUserDocsMap.get(uid));
    const likes = likesUserDocs.map(mapPostUserInfo);
    const postsLikesDoc = postsLikesDocs.find(d => d.postId.equals(post._id));
    const { numLikes } = postsLikesDoc;
    const postInfo: PostWithAuthorInfoAndLikes = {
      authorInfo,
      likeUserIds,
      post,
      numLikes,
      likes,
    };
    return postInfo;
  });
  const result: Services.GetPostsWithAuthorInfoAndLikes = {
    posts: postsInfo,
  };
  res.status(200).json(result);
});

// Get a post
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const postDoc = await PostModel.findById(id);
    if (!postDoc) {
      res.sendStatus(404);
      return;
    }
    let filteredPost: Services.GetPostById = {
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
    return res.status(200).send(filteredPost);
  } catch (err) {
    if (err.name) {
      switch (err.name) {
        case 'CastError':
          res.sendStatus(404);
          return;
        default:
          break;
      }
    }
    console.log(`Failed to get post ${id}`, err);
    return next(err);
  }
});

export default router;
