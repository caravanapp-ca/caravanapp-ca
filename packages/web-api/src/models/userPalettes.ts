import { model, Schema } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  UserPalettes,
} from '@caravan/buddy-reading-types';
import { UserPalettesDoc } from '@caravan/buddy-reading-mongo';

const userPalettesDefinition: SameKeysAs<FilterAutoMongoKeys<UserPalettes>> = {
  userId: { type: String, required: true },
  hasSets: { type: [String] },
  hasIndividuals: { type: [String] },
};

const userPalettesSchema = new Schema(userPalettesDefinition, {
  _id: false,
  timestamps: true,
});

export default model<UserPalettesDoc>(
  'UserPalettes',
  userPalettesSchema,
  'userPalettes'
);
