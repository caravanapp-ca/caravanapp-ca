import { model, Document, Schema, Types } from 'mongoose';
import { Omit } from 'utility-types';
import { Badge, Badges } from '@caravanapp/buddy-reading-types';
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
