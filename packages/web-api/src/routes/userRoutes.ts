import express from 'express';
import { check } from 'express-validator';
import mongoose from 'mongoose';
import { Omit } from 'utility-types';
import {
  User,
  ReadingSpeed,
  FilterAutoMongoKeys,
  UserQA,
} from '@caravan/buddy-reading-types';
import UserModel from '../models/user';
import { isAuthenticated } from '../middleware/auth';
import { userSlugExists } from '../services/user';
import { getGenreDoc } from '../services/genre';
import { getProfileQuestions } from '../services/profileQuestions';
import { UserDoc } from '../../typings';
import { checkObjectIdIsValid } from '../common/mongoose';

const router = express.Router();

// Get a user
router.get('/:urlSlugOrId', async (req, res, next) => {
  const { urlSlugOrId } = req.params;
  try {
    let user: UserDoc;
    const isObjId = checkObjectIdIsValid(urlSlugOrId);
    if (!isObjId) {
      user = await UserModel.findOne({ urlSlug: urlSlugOrId });
    } else {
      user = await UserModel.findById(urlSlugOrId);
    }
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
  // TODO: Uncomment this isAuthenticated,
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
  check('shelf').exists(),
  async (req, res, next) => {
    const userId = '5d0eb02837cff574b9f3add6';
    // TODO: Uncomment this and delete line 2 below.
    // const { userId } = req.session;
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
      questions: userQA,
      shelf: userShelf,
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
