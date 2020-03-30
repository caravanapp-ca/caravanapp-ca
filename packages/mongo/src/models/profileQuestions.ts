import { Document, model, Schema, Types } from 'mongoose';

import {
  MongoTimestamps,
  ProfileQuestion,
  ProfileQuestions,
} from '@caravanapp/types';

import { MongooseSchema } from '../common/mongoose';

export interface ProfileQuestionsDoc
  extends Document,
    MongoTimestamps,
    Omit<ProfileQuestions, '_id' | 'questions'> {
  _id: Types.ObjectId;
  questions: (ProfileQuestion & { visible: boolean })[];
}

const profileQuestionSchemaDefinition: MongooseSchema<
  ProfileQuestionsDoc['questions'][0]
> = {
  id: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  required: { type: Boolean, required: true },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  visible: { type: Boolean, required: true, index: true },
};

const profileQuestionSchema = new Schema(profileQuestionSchemaDefinition, {
  _id: false,
});

const profileQuestionsSchemaDefinition: MongooseSchema<ProfileQuestions> = {
  questions: { type: [profileQuestionSchema], required: true },
};

const profileQuestionsSchema = new Schema<ProfileQuestionsDoc>(
  profileQuestionsSchemaDefinition,
  {
    timestamps: true,
  }
);

export const ProfileQuestionsModel = model<ProfileQuestionsDoc>(
  'ProfileQuestion',
  profileQuestionsSchema,
  'profileQuestions'
);
