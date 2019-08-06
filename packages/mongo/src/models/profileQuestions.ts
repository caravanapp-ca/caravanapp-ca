import { Document, model, Schema, Types } from 'mongoose';
import {
  FilterAutoMongoKeys,
  MongoTimestamps,
  ProfileQuestion,
  ProfileQuestions,
  SameKeysAs,
} from '@caravan/buddy-reading-types';

export interface ProfileQuestionsDoc
  extends Document,
    MongoTimestamps,
    Omit<ProfileQuestions, '_id' | 'questions'> {
  _id: Types.ObjectId;
  questions: (ProfileQuestion & { visible: boolean })[];
}

const profileQuestionSchemaDefinition: SameKeysAs<
  FilterAutoMongoKeys<ProfileQuestionsDoc['questions'][0]>
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

export const ProfileQuestionsModel = model<ProfileQuestionsDoc>(
  'ProfileQuestion',
  profileQuestionsSchema,
  'profileQuestions'
);
