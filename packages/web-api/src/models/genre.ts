import { model, Schema } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  Genres,
  Genre,
} from '@caravan/buddy-reading-types';
import { GenreDoc } from '../../typings';

const genreSchemaDefinition: SameKeysAs<FilterAutoMongoKeys<Genre>> = {
  key: { type: String, required: true },
  name: { type: String, required: true },
  subgenres: { type: [String], required: true },
};

const genreSchema = new Schema(genreSchemaDefinition, {});

const genresSchemaDefinition: SameKeysAs<FilterAutoMongoKeys<Genres>> = {
  mainGenres: { type: [String], required: true },
  genres: { type: { key: genreSchema }, required: true },
};

const genresSchema = new Schema<GenreDoc>(genresSchemaDefinition, {
  timestamps: true,
});

export default model<GenreDoc>('Genre', genresSchema);
