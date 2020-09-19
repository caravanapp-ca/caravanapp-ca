import { Document, model, Schema, Types } from 'mongoose';

import type { Badge, Badges } from '@caravanapp/types';

import { MongooseSchema } from '../common/mongoose';

export interface BadgeDoc extends Document, Omit<Badges, '_id'> {
  _id: Types.ObjectId;
}

const badgeDefinition: MongooseSchema<Badge> = {
  key: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
};

const badgesDefinition: MongooseSchema<Badges> = {
  badgeKeys: { type: [String], required: true },
  badges: { type: { key: badgeDefinition }, required: true },
};

const badgesSchema = new Schema(badgesDefinition);

export const BadgeModel = model<BadgeDoc>('Badge', badgesSchema);
