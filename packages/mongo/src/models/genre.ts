import { Document, model, Schema, Types } from 'mongoose';

import { Genre, Genres } from '@caravanapp/types';

import { MongooseSchema } from '../common/mongoose';

export interface GenreDoc extends Document, Omit<Genres, '_id'> {
  _id: Types.ObjectId;
}

const genreSchemaDefinition: MongooseSchema<Genre> = {
  key: { type: String, required: true },
  name: { type: String, required: true },
  subgenres: { type: [String], required: true },
};

const genreSchema = new Schema(genreSchemaDefinition, {
  _id: false,
});

const genresSchemaDefinition: MongooseSchema<Genres> = {
  mainGenres: { type: [String], required: true },
  genres: { type: { key: genreSchema }, required: true },
};

const genresSchema = new Schema<GenreDoc>(genresSchemaDefinition, {
  timestamps: true,
});

export const GenreModel = model<GenreDoc>('Genre', genresSchema);
