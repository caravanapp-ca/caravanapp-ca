import express from 'express';

import { GenreModel } from '@caravanapp/mongo';
import { Genres, Services } from '@caravanapp/types';

const router = express.Router();

router.get('/genres', async (req, res, next) => {
  try {
    const genreDoc = await GenreModel.findOne().sort({ createdAt: -1 }).exec();
    if (!genreDoc) {
      res.status(500).send('No genres found, oops!');
      return;
    }
    const obj: Genres = genreDoc.toObject();
    const resData: Services.GetGenres = {
      genres: obj.genres,
      mainGenres: obj.mainGenres,
    };
    res.status(200).json(resData);
  } catch (err) {
    console.error('Failed to get genres.', err);
    return next(err);
  }
});

export default router;
