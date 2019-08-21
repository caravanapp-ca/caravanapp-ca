import { Document, model, Schema, Types } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  EmailSettings,
  UserSettings,
} from '@caravan/buddy-reading-types';

export interface UserSettingsDoc extends Document, Omit<UserSettings, '_id'> {
  _id: Types.ObjectId;
}

const emailSettingsDefinition: SameKeysAs<EmailSettings> = {
  recs: { type: Boolean, required: true },
  reminders: { type: Boolean, required: true },
  updates: { type: Boolean, required: true },
};

const UserSettingsDefinition: SameKeysAs<FilterAutoMongoKeys<UserSettings>> = {
  userId: { type: Types.ObjectId, required: true },
  emailSettings: {
    type: emailSettingsDefinition,
    required: true,
    default: {
      recs: true,
      reminders: true,
      updates: true,
    },
  },
  email: { type: String },
};

const UserSettingsSchema = new Schema(UserSettingsDefinition, {
  timestamps: true,
});

export const UserSettingsModel = model<UserSettingsDoc>(
  'UserSettings',
  UserSettingsSchema,
  'userSettings'
);
