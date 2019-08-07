import { Document, model, Schema, Types } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  UserSettings,
} from '@caravan/buddy-reading-types';

export interface UserSettingsDoc extends Document, Omit<UserSettings, '_id'> {
  _id: Types.ObjectId;
}

const UserSettingsDefinition: SameKeysAs<FilterAutoMongoKeys<UserSettings>> = {
  userId: { type: Types.ObjectId, required: true },
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
