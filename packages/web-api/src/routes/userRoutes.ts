import express from 'express';
import { check } from 'express-validator';
import mongoose from 'mongoose';
import { Omit } from 'utility-types';
import {
  User,
  ReadingSpeed,
  FilterAutoMongoKeys,
} from '@caravan/buddy-reading-types';
import UserModel from '../models/user';
import { isAuthenticated } from '../middleware/auth';
import { userSlugExists } from '../services/user';

const router = express.Router();

// Get a user
router.get('/:urlSlug', async (req, res, next) => {
  const { urlSlug } = req.params;
  try {
    const userExists = await userSlugExists(urlSlug);
    if (userExists) {
      res.status(409).send('User already exists.');
    } else {
      res.sendStatus(200);
    }
  } catch (err) {
    const { code } = err;
    switch (code) {
      default:
        console.log(
          `Failed to get user with slug ${urlSlug}. Code ${code}.`,
          err
        );
        return next(err);
    }
  }
});

// Get users by array of userIds
router.post('/users', async (req, res, next) => {
  const { userIds } = req.body;
  if (Array.isArray(userIds)) {
    try {
      const userIdsAsObj = userIds.map(uid => mongoose.Types.ObjectId(uid));
      const users = await UserModel.find({
        _id: { $in: userIdsAsObj },
      });
      res.json(users);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  } else {
    res
      .status(400)
      .send('Error: `userIds` must be an array of user id strings');
  }
});

// Create a user
router.post('/', async (req, res, next) => {
  try {
    const user = new UserModel(req.body);
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.log('Failed to create new user', err);
    return next(err);
  }
});

const READING_SPEEDS: ReadingSpeed[] = ['slow', 'moderate', 'fast'];

router.post('/:urlSlug/available', async (req, res, next) => {
  const { urlSlug } = req.params;
  try {
    const userExists = await userSlugExists(urlSlug);
    if (userExists) {
      res.status(409).send('User already exists.');
    } else {
      res.sendStatus(200);
    }
  } catch (err) {
    const { code } = err;
    switch (code) {
      default:
        console.log(
          `Failed to get user with slug ${urlSlug}. Code ${code}.`,
          err
        );
        return next(err);
    }
  }
});

// TODO: Consider moving the update validation to the mongoose level
// Modify a user
router.put(
  '/:urlSlug',
  isAuthenticated,
  check(['bio'], 'Bio must not be more than 150 characters')
    .isString()
    .isLength({ max: 150 })
    .optional(),
  check(['goodreadsUrl', 'website', 'photoUrl', 'smallPhotoUrl'])
    .isURL()
    .optional(),
  check('name')
    .isString()
    .isLength({ min: 2, max: 100 }),
  check(
    'readingSpeed',
    `Reading speed must be one of ${READING_SPEEDS.join(',')}`
  ).isIn(READING_SPEEDS),
  check('age', 'Must be a valid age')
    .isInt({ min: 13, max: 150 })
    .optional(),
  check('gender')
    .isString()
    .isLength({ min: 1, max: 50 })
    .optional(),
  check('location')
    .isString()
    .isLength({ max: 300 })
    .optional(),
  check('urlSlug')
    .isString()
    .isLength({ min: 5, max: 20 }),
  async (req, res, next) => {
    const { userId } = req.session;
    const { urlSlug } = req.params;
    const user: User = req.body;
    const slugExists = await userSlugExists(urlSlug);
    if (slugExists) {
      res.status(409).send('User already exists.');
      return;
    }
    const newUser: Omit<
      FilterAutoMongoKeys<User>,
      'isBot' | 'smallPhotoUrl' | 'discordId'
    > = {
      age: user.age,
      bio: user.bio,
      gender: user.gender,
      goodreadsUrl: user.goodreadsUrl,
      location: user.location,
      name: user.name,
      photoUrl: user.photoUrl,
      readingSpeed: user.readingSpeed,
      urlSlug: user.urlSlug,
      website: user.website,
    };
    try {
      const userDoc = await UserModel.findByIdAndUpdate(userId, newUser);
      res.status(200).send(userDoc);
    } catch (err) {
      console.error('Failed to save user data', err);
      res.status(400).send('Failed to save user data');
    }
  }
);

export default router;
