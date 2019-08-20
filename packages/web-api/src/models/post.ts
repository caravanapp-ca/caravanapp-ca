import { model, Schema } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  Post,
  ShelfPost,
  ShelfEntry,
  BookSource,
  ProgressUpdatePost,
  WantToReadAboutPost,
} from '@caravan/buddy-reading-types';
import { PostDoc } from '../../typings';
import { ALLOWED_BOOK_SOURCES } from '../common/club';

const genresSchema = new Schema({
  key: String,
  name: String,
});

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

const shelfSchema: SameKeysAs<FilterAutoMongoKeys<ShelfEntry>> = {
  source: {
    type: String,
    required: true,
    index: true,
    validate: {
      validator: function(v: BookSource) {
        return ALLOWED_BOOK_SOURCES[v] === true;
      },
      message: function(props: { value: string }) {
        `${props.value} is not a valid source.`;
      },
    },
  },
  sourceId: { type: String, required: true, index: true },
  isbn: { type: String },
  readingState: { type: String, required: true },
  startedReading: { type: Date },
  finishedReading: { type: Date },
  title: { type: String, required: true },
  author: { type: String },
  publishedDate: { type: Date },
  coverImageURL: { type: String },
  genres: { type: [String], required: true },
};

const shelfPostSchemaDefinition: SameKeysAs<FilterAutoMongoKeys<ShelfPost>> = {
  postType: {
    type: String,
    required: true,
    validate: {
      validator: function(v: String) {
        return v === 'shelf';
      },
      message: function(props: { value: string }) {
        `${props.value} does not match the expected value, shelf.`;
      },
    },
  },
  shelf: { type: [shelfSchema], required: true },
  title: { type: String, required: true },
  description: { type: String },
  genres: { type: [genresSchema] },
  interests: { type: [interestsSchema] },
};

const shelfPostSchema = new Schema(shelfPostSchemaDefinition, {
  _id: false,
});

const progressUpdatePostSchemaDefinition: SameKeysAs<
  FilterAutoMongoKeys<ProgressUpdatePost>
> = {
  postType: {
    type: String,
    required: true,
    validate: {
      validator: function(v: String) {
        return v === 'progressUpdate';
      },
      message: function(props: { value: string }) {
        `${props.value} does not match the expected value, progressUpdate.`;
      },
    },
  },
  book: { type: shelfSchema, required: true },
  progressUpdateType: {
    type: String,
    required: true,
  },
  containsSpoiler: { type: Boolean, required: true },
  description: { type: String, required: true },
};

const progressUpdatePostSchema = new Schema(
  progressUpdatePostSchemaDefinition,
  {
    _id: false,
  }
);

const wantToReadAboutSchemaDefinition: SameKeysAs<
  FilterAutoMongoKeys<WantToReadAboutPost>
> = {
  postType: {
    type: String,
    required: true,
    validate: {
      validator: function(v: String) {
        return v === 'wantToReadAbout';
      },
      message: function(props: { value: string }) {
        `${props.value} does not match the expected value, wantToReadAbout.`;
      },
    },
  },
  genres: { type: [genresSchema] },
  interests: { type: [interestsSchema] },
  description: { type: String, required: true },
};

const wantToReadAboutSchema = new Schema(wantToReadAboutSchemaDefinition, {
  _id: false,
});

const postDefinition: SameKeysAs<FilterAutoMongoKeys<Post>> = {
  authorId: { type: String, required: true },
  content: {
    type: shelfPostSchema || progressUpdatePostSchema || wantToReadAboutSchema,
    required: true,
  },
};

const postSchema = new Schema<PostDoc>(postDefinition, {
  timestamps: true,
});

export default model<PostDoc>('Post', postSchema);
