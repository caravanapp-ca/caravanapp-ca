import { model, Schema } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  UserPalettes,
} from '@caravan/buddy-reading-types';
import { UserPalettesDoc } from '../../typings';

const userPalettesDefinition: SameKeysAs<FilterAutoMongoKeys<UserPalettes>> = {
  userId: { type: String, required: true },
  hasSets: { type: [String] },
  hasIndividuals: { type: [String] },
};

const userPalettesSchema = new Schema(userPalettesDefinition, {
  timestamps: true,
});

export default model<UserPalettesDoc>('UserPalettes', userPalettesSchema);
