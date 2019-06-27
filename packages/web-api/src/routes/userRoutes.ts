import express from 'express';
import { check } from 'express-validator';
import mongoose from 'mongoose';
import { Omit } from 'utility-types';
import {
  User,
  ReadingSpeed,
  FilterAutoMongoKeys,
} from '@caravan/buddy-reading-types';
import GenreModel from '../models/genre';
import UserModel from '../models/user';
import { isAuthenticated } from '../middleware/auth';
import { userSlugExists } from '../services/user';
import { getGenreDoc } from '../services/genre';

const router = express.Router();

// Get a user
router.get('/:urlSlug', async (req, res, next) => {
  const { urlSlug } = req.params;
  try {
    const user = await UserModel.findOne({ urlSlug: { $eq: urlSlug } });
    if (user) {
      res.status(200).send(user.toJSON());
    } else {
      res.sendStatus(400);
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
  '/',
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
  check('selectedGenres').isArray(),
  async (req, res, next) => {
    const { userId } = req.session;
    const user: User = req.body;

    const genreDoc = await getGenreDoc();
    if (!genreDoc) {
      res.status(500).send('No genres found, oops!');
      return;
    }

    const userGenres = user.selectedGenres
      .map(g => {
        const validGenre = genreDoc.genres[g.key];
        if (validGenre) {
          const newValidUserGenre: { key: string; name: string } = {
            key: g.name,
            name: validGenre.name,
          };
          return newValidUserGenre;
        }
        throw new Error(`Unknown genre: ${g.key}, ${g.name}`);
      })
      .sort((a, b) => a.name.localeCompare(b.name));

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
      selectedGenres: userGenres,
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
