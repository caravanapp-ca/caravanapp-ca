import { Document, model, Schema, Types } from 'mongoose';

import type {
  MongoTimestamps,
  Post,
  ProgressUpdatePost,
  ShelfPost,
  WantToReadAboutPost,
} from '@caravanapp/types';

import { MongooseSchema } from '../common/mongoose';
import { genresSchema, shelfSchemaDefinition } from './club';

export interface PostDoc extends Document, MongoTimestamps, Omit<Post, '_id'> {
  _id: Types.ObjectId;
}

const interestsSchema = new Schema({
  key: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: String,
});

const shelfPostSchemaDefinition: MongooseSchema<ShelfPost> = {
  postType: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        return v === 'shelf';
      },
    },
  },
  shelf: { type: [shelfSchemaDefinition], required: true },
  title: { type: String, required: true },
  description: { type: String },
  genres: { type: [genresSchema] },
  interests: { type: [interestsSchema] },
};

const shelfPostSchema = new Schema<ShelfPost>(shelfPostSchemaDefinition, {
  _id: false,
});

const progressUpdatePostSchemaDefinition: MongooseSchema<ProgressUpdatePost> = {
  postType: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        return v === 'progressUpdate';
      },
    },
  },
  book: { type: shelfSchemaDefinition, required: true },
  progressUpdateType: {
    type: String,
    required: true,
  },
  containsSpoiler: { type: Boolean, required: true },
  description: { type: String, required: true },
};

const progressUpdatePostSchema = new Schema<ProgressUpdatePost>(
  progressUpdatePostSchemaDefinition,
  {
    _id: false,
  }
);

const wantToReadAboutSchemaDefinition: MongooseSchema<WantToReadAboutPost> = {
  postType: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        return v === 'wantToReadAbout';
      },
    },
  },
  genres: { type: [genresSchema] },
  interests: { type: [interestsSchema] },
  description: { type: String, required: true },
};

const wantToReadAboutSchema = new Schema<WantToReadAboutPost>(
  wantToReadAboutSchemaDefinition,
  {
    _id: false,
  }
);

const postDefinition: MongooseSchema<Post> = {
  authorId: { type: String, required: true },
  content: {
    type: shelfPostSchema || progressUpdatePostSchema || wantToReadAboutSchema,
    required: true,
  },
};

const postSchema = new Schema<PostDoc>(postDefinition, {
  timestamps: true,
});

export const PostModel = model<PostDoc>('Post', postSchema);
