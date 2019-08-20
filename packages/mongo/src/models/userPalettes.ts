import { model, Schema, Types, Document } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  UserPalettes,
} from '@caravan/buddy-reading-types';

export interface UserPalettesDoc extends Document, Omit<UserPalettes, '_id'> {
  _id: Types.ObjectId;
}

const userPalettesDefinition: SameKeysAs<FilterAutoMongoKeys<UserPalettes>> = {
  userId: { type: String, required: true },
  hasSets: { type: [String] },
  hasIndividuals: { type: [String] },
};

const userPalettesSchema = new Schema(userPalettesDefinition, {
  timestamps: true,
});

export const UserPalettesModel = model<UserPalettesDoc>(
  'UserPalettes',
  userPalettesSchema,
  'userPalettes'
);
