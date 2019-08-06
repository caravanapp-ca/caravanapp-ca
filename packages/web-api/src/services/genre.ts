import { GenreModel } from '@caravan/buddy-reading-mongo';

export const getGenreDoc = async () => {
  const genreDoc = await GenreModel.findOne()
    .sort({ createdAt: -1 })
    .exec();
  return genreDoc;
};
