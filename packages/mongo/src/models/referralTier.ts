import { Document, model, Schema, Types } from 'mongoose';
import { ReferralTier, ReferralTiers } from '@caravan/buddy-reading-types';
import { MongooseSchema } from '../common/mongoose';

export interface ReferralTierDoc extends Document, Omit<ReferralTiers, '_id'> {
  _id: Types.ObjectId;
}

const referralTierDefinition: MongooseSchema<ReferralTier> = {
  tierNumber: { type: Number, required: true },
  referralCount: { type: Number, required: true },
  title: { type: String, required: true },
  profileBgSets: { type: [String], required: true, default: [] },
  badgeKey: { type: String },
  discordRole: { type: String },
};

const referralTiersDefinition: MongooseSchema<ReferralTiers> = {
  tiers: { type: [referralTierDefinition], required: true },
};

const referralTiersSchema = new Schema(referralTiersDefinition);

export const ReferralTierModel = model<ReferralTierDoc>(
  'ReferralTier',
  referralTiersSchema,
  'referralTiers'
);
