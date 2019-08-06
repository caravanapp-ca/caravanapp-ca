import { model, Document, Schema, Types } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  Genres,
  Genre,
} from '@caravan/buddy-reading-types';

export interface GenreDoc extends Document, Omit<Genres, '_id'> {
  _id: Types.ObjectId;
}

const genreSchemaDefinition: SameKeysAs<FilterAutoMongoKeys<Genre>> = {
  key: { type: String, required: true },
  name: { type: String, required: true },
  subgenres: { type: [String], required: true },
};

const genreSchema = new Schema(genreSchemaDefinition, {
  _id: false,
});

const genresSchemaDefinition: SameKeysAs<FilterAutoMongoKeys<Genres>> = {
  mainGenres: { type: [String], required: true },
  genres: { type: { key: genreSchema }, required: true },
};

const genresSchema = new Schema<GenreDoc>(genresSchemaDefinition, {
  timestamps: true,
});

export const GenreModel = model<GenreDoc>('Genre', genresSchema);
