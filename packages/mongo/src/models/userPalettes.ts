import { Document, model, Schema, Types } from 'mongoose';

import type { UserPalettes } from '@caravanapp/types';

import { MongooseSchema } from '../common/mongoose';

export interface UserPalettesDoc extends Document, Omit<UserPalettes, '_id'> {
  _id: Types.ObjectId;
}

const userPalettesDefinition: MongooseSchema<UserPalettes> = {
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
