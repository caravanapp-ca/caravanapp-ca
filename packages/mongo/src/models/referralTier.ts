import { Document, model, Schema, Types } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  ReferralTier,
  ReferralTiers,
} from '@caravan/buddy-reading-types';

export interface ReferralTierDoc extends Document, Omit<ReferralTiers, '_id'> {
  _id: Types.ObjectId;
}

const referralTierDefinition: SameKeysAs<FilterAutoMongoKeys<ReferralTier>> = {
  tierNumber: { type: Number, required: true },
  referralCount: { type: Number, required: true },
  title: { type: String, required: true },
  badgeKey: { type: String },
  discordRole: { type: String },
};

const referralTiersDefinition: SameKeysAs<
  FilterAutoMongoKeys<ReferralTiers>
> = {
  tiers: { type: [referralTierDefinition], required: true },
};

const referralTiersSchema = new Schema(referralTiersDefinition);

export const ReferralTierModel = model<ReferralTierDoc>(
  'ReferralTier',
  referralTiersSchema,
  'referralTiers'
);
