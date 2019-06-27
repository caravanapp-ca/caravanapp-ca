import GenreModel from '../models/genre';

export const getGenreDoc = async () => {
  const genreDoc = await GenreModel.findOne()
    .sort({ created_at: -1 })
    .exec();
  return genreDoc;
};
