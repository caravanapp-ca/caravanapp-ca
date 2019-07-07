import express from 'express';
import { check } from 'express-validator';
import { Omit } from 'utility-types';
import mongoose from 'mongoose';
import {
  User,
  ReadingSpeed,
  FilterAutoMongoKeys,
  UserQA,
  ShelfEntry,
} from '@caravan/buddy-reading-types';
import UserModel from '../models/user';
import { isAuthenticatedButNotNecessarilyOnboarded } from '../middleware/auth';
import { userSlugExists, getMe, getUser } from '../services/user';
import { getGenreDoc } from '../services/genre';
import { getProfileQuestions } from '../services/profileQuestions';

const router = express.Router();

// Get me, includes more sensitive stuff
router.get('/@me', async (req, res, next) => {
  const { userId } = req.session;
  try {
    const user = await getMe(userId);
    if (user) {
      res.status(200).send(user.toJSON());
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    const { code } = err;
    switch (code) {
      default:
        console.log(`Failed to get me ${userId}. Code ${code}.`, err);
        return next(err);
    }
  }
});

// Get a user
router.get('/:urlSlugOrId', async (req, res, next) => {
  const { urlSlugOrId } = req.params;
  try {
    const user = await getUser(urlSlugOrId);
    if (user) {
      res.status(200).send(user.toJSON());
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    const { code } = err;
    switch (code) {
      default:
        console.log(`Failed to get user ${urlSlugOrId}. Code ${code}.`, err);
        return next(err);
    }
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

interface ShelfEntryWithObjId extends Omit<ShelfEntry, '_id'> {
  _id: mongoose.Types.ObjectId;
}

// TODO: Consider moving the update validation to the mongoose level
// Modify a user
router.put(
  '/',
  isAuthenticatedButNotNecessarilyOnboarded,
  check(['bio'], 'Bio must not be more than 150 characters')
    .isString()
    .isLength({ max: 150 })
    .optional(),
  check(['goodreadsUrl', 'website', 'photoUrl', 'smallPhotoUrl'])
    .isURL()
    .optional(),
  check('name')
    .isString()
    .isLength({ min: 2, max: 30 })
    .optional(),
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
  check('selectedGenres')
    .isArray()
    .optional(),
  check('shelf')
    .exists()
    .optional(),
  check('questions').isArray(),
  check('onboardingVersion')
    .isNumeric()
    .optional(),
  async (req, res, next) => {
    const { userId } = req.session;
    const user: User = req.body;
    const genreDoc = await getGenreDoc();
    if (!genreDoc) {
      res.status(500).send('No genres found, oops!');
      return;
    }

    const userShelf = user.shelf;
    if (!userShelf.notStarted || userShelf.notStarted.length > 500) {
      throw new Error(
        'Shelf object is missing the notStarted key, or you passed over 500 entries!'
      );
    }
    if (!userShelf.read || userShelf.read.length > 5000) {
      throw new Error(
        'Shelf object is missing the read key, or you passed over 5000 entries!'
      );
    }
    userShelf.notStarted.forEach(
      b =>
        //@ts-ignore
        (b.genres = b.genres || []) && (b._id = undefined)
    );
    userShelf.read.forEach(
      b =>
        (b.genres = b.genres || []) &&
        //@ts-ignore
        (b._id = b._id ? new mongoose.Types.ObjectId(b._id) : undefined)
    );

    const userGenres = user.selectedGenres
      .map(g => {
        const validGenre = genreDoc.genres[g.key];
        if (validGenre) {
          const newValidUserGenre: { key: string; name: string } = {
            key: g.key,
            name: validGenre.name,
          };
          return newValidUserGenre;
        }
        throw new Error(`Unknown genre: ${g.key}, ${g.name}`);
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    const questionDoc = await getProfileQuestions();
    if (!questionDoc) {
      res.status(500).send('No questions found, oops!');
      return;
    }

    const userQA = user.questions.map(q => {
      const validQuestion = questionDoc.questions.find(f => f.id === q.id);
      if (validQuestion) {
        const newUserQA: UserQA = {
          ...q,
          title: validQuestion.title,
        };
        return newUserQA;
      }
      throw new Error(`Unknown question: ${q.id}, ${q.title}`);
    });

    const newUserButWithPossibleNullValues: Omit<
      FilterAutoMongoKeys<User>,
      | 'isBot'
      | 'smallPhotoUrl'
      | 'discordId'
      | 'discordUsername'
      | 'onboardingVersion'
      | 'urlSlug'
    > = {
      age: user.age,
      bio: user.bio,
      gender: user.gender,
      goodreadsUrl: user.goodreadsUrl,
      location: user.location,
      name: user.name,
      photoUrl: user.photoUrl,
      readingSpeed: user.readingSpeed,
      website: user.website,
      selectedGenres: userGenres,
      questions: userQA,
      shelf: userShelf,
    };

    const writeableObj: any = newUserButWithPossibleNullValues;
    Object.keys(writeableObj).forEach(key => {
      switch (key) {
        default:
          writeableObj[key] == null && delete writeableObj[key];
      }
    });

    try {
      let userDoc = await UserModel.findByIdAndUpdate(userId, writeableObj);
      if (
        userDoc &&
        userDoc.onboardingVersion === 0 &&
        user.onboardingVersion === 1
      ) {
        // Can do extra on-boarding behind-the-scenes logic here onInit, but for now not necessary...
        // Perhaps send email or whatever.
        userDoc.onboardingVersion = 1;
        userDoc = await userDoc.save();
      }
      res.status(200).send(userDoc);
    } catch (err) {
      console.error('Failed to save user data', err);
      res.status(400).send('Failed to save user data');
    }
  }
);

export default router;
