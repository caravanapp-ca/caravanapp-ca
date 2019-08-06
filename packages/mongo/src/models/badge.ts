import { model, Document, Schema, Types } from 'mongoose';
import { Omit } from 'utility-types';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  Badges,
  Badge,
} from '@caravan/buddy-reading-types';

export interface BadgeDoc extends Document, Omit<Badges, '_id'> {
  _id: Types.ObjectId;
}

const badgeDefinition: SameKeysAs<FilterAutoMongoKeys<Badge>> = {
  key: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
};

const badgesDefinition: SameKeysAs<FilterAutoMongoKeys<Badges>> = {
  badgeKeys: { type: [String], required: true },
  badges: { type: { key: badgeDefinition }, required: true },
};

const badgesSchema = new Schema(badgesDefinition);

export const BadgeModel = model<BadgeDoc>('Badge', badgesSchema);
