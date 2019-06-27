import { model, Schema } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  ProfileQuestion,
  ProfileQuestions,
} from '@caravan/buddy-reading-types';
import { ProfileQuestionsDoc } from '../../typings';

const profileQuestionSchemaDefinition: SameKeysAs<
  FilterAutoMongoKeys<ProfileQuestion>
> = {
  id: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  required: { type: Boolean, required: true },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
};

const profileQuestionSchema = new Schema(profileQuestionSchemaDefinition, {});

const profileQuestionsSchemaDefinition: SameKeysAs<
  FilterAutoMongoKeys<ProfileQuestions>
> = {
  questions: { type: profileQuestionSchema, required: true },
};

const profileQuestionsSchema = new Schema<ProfileQuestionsDoc>(
  profileQuestionsSchemaDefinition,
  {
    timestamps: true,
  }
);

export default model<ProfileQuestionsDoc>(
  'ProfileQuestion',
  profileQuestionsSchema
);
