import { model, Schema } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  Badges,
  Badge,
} from '@caravan/buddy-reading-types';
import { BadgeDoc } from '../../';

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
