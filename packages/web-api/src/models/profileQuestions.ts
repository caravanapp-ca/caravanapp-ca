import { model, Schema } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  ProfileQuestions,
} from '@caravan/buddy-reading-types';
import { ProfileQuestionsDoc } from '../../typings';

const profileQuestionSchemaDefinition: SameKeysAs<
  FilterAutoMongoKeys<ProfileQuestionsDoc['questions']>
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

const profileQuestionsSchemaDefinition: SameKeysAs<
  FilterAutoMongoKeys<ProfileQuestions>
> = {
  questions: { type: [profileQuestionSchema], required: true },
};

const profileQuestionsSchema = new Schema<ProfileQuestionsDoc>(
  profileQuestionsSchemaDefinition,
  {
    timestamps: true,
  }
);

export default model<ProfileQuestionsDoc>(
  'ProfileQuestion',
  profileQuestionsSchema,
  'profileQuestions'
);
