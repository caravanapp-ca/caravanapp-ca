import express from 'express';
import { check, validationResult } from 'express-validator';
import { Omit } from 'utility-types';
import mongoose from 'mongoose';
import {
  User,
  ReadingSpeed,
  FilterAutoMongoKeys,
  UserQA,
  Services,
  ActiveFilter,
} from '@caravan/buddy-reading-types';
import UserModel from '../models/user';
import { isAuthenticatedButNotNecessarilyOnboarded } from '../middleware/auth';
import { userSlugExists, getMe, getUser } from '../services/user';
import { getGenreDoc } from '../services/genre';
import { getProfileQuestions } from '../services/profileQuestions';
import { UserDoc } from '../../typings';

const router = express.Router();

// TODO write the get all clubs method

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

router.get('/', async (req, res, next) => {
  const { after, pageSize, activeFilter } = req.query;
  const { userId } = req.session;
  let user: UserDoc | undefined;
  if (userId) {
    user = await getUser(userId);
  }
  // Calculate number of documents to skip
  const query: any = {
    unlisted: { $eq: false },
  };
  if (after) {
    query._id = { $lt: after };
  }
  const size = Number.parseInt(pageSize || 0);
  const limit = Math.min(Math.max(size, 10), 50);
  let users: UserDoc[];
  try {
    users = await UserModel.find(query)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  } catch (err) {
    console.error('Failed to get all users, ', err);
    res.status(500).send(`Failed to get all users: ${err}`);
  }
  if (!users) {
    res.sendStatus(404);
    return;
  }

  // const filteredUsers: Services.GetUsers['users'] = users
  //   .map(userDocument => {
  //     const user: Omit<User, 'createdAt' | 'updatedAt'> & {
  //       createdAt: string;
  //       updatedAt: string;
  //     } = {
  //       ...userDocument.toObject(),
  //       createdAt:
  //         userDocument.createdAt instanceof Date
  //           ? userDocument.createdAt.toISOString()
  //           : userDocument.createdAt,
  //       updatedAt:
  //         userDocument.updatedAt instanceof Date
  //           ? userDocument.updatedAt.toISOString()
  //           : userDocument.updatedAt,
  //     };
  //     const obj: Services.GetUsers['users'][0] = {
  //       ...user,
  //     };
  //     return obj;
  //   })
  //   .filter(c => c !== null);
  const result: Services.GetUsers = {
    users: users,
  };
  res.status(200).json(result);
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
    .optional({ checkFalsy: true }),
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
    ['goodreadsUrl', 'website', 'photoUrl', 'smallPhotoUrl'].forEach(
      x => (req.body[x] = x == null || x == '' ? undefined : req.body[x])
    );
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorArr = errors.array();
      console.warn(
        `User {id: ${req.user.id}, name: ${
          req.user.name
        }} failed user update.\n${errorArr.toString()}\n${req.body}`
      );
      res.status(422).json({ errors: errorArr });
      return;
    }
    const { userId } = req.session;
    const user: User = req.body;
    const [genreDoc, questionDoc] = await Promise.all([
      getGenreDoc(),
      getProfileQuestions(),
    ]);
    if (!questionDoc) {
      res.status(500).send('No questions found, oops!');
      return;
    }
    if (!genreDoc) {
      res.status(500).send('No genres found, oops!');
      return;
    }

    const notStartedLimit = 500;
    const userShelf = user.shelf;
    if (
      !userShelf.notStarted ||
      userShelf.notStarted.length > notStartedLimit
    ) {
      console.warn(
        `User {id: ${req.user.id}, name: ${req.user.name}} missing notStarted key, or passed over ${notStartedLimit} entries.`
      );
      res
        .status(400)
        .send(
          `Shelf object is missing the notStarted key, or you passed over ${notStartedLimit} entries!`
        );
      return;
    }
    const readLimit = 1000;
    if (!userShelf.read || userShelf.read.length > readLimit) {
      console.warn(
        `User {id: ${req.user.id}, name: ${req.user.name}} shelf object is missing the read key, or passed over ${readLimit} entries!`
      );
      res
        .status(400)
        .send(
          `Shelf object is missing the read key, or you passed over ${readLimit} entries!`
        );
      return;
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

    let userGenres: {
      key: string;
      name: string;
    }[];
    let userQA: UserQA[];
    try {
      userGenres = user.selectedGenres
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

      userQA = user.questions.map(q => {
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
    } catch (err) {
      console.warn(
        `User {id: ${req.user.id}, name: ${req.user.name}} update user QA/genre issue:\n${err}`
      );
      res.status(400).send(err);
      return;
    }

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
      palette: user.palette,
    };

    const writeableObj: any = newUserButWithPossibleNullValues;
    Object.keys(writeableObj).forEach(key => {
      switch (key) {
        case 'palette':
          break;
        default:
          writeableObj[key] == null && delete writeableObj[key];
      }
    });

    try {
      let userDoc = await UserModel.findByIdAndUpdate(userId, writeableObj, {
        new: true,
      });
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
