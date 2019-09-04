import { model, Schema, Types, Document } from 'mongoose';
import { UserPalettes } from '@caravan/buddy-reading-types';
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
