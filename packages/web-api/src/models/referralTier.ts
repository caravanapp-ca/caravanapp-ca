import { model, Schema } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  ReferralTier,
  ReferralTiers,
} from '@caravan/buddy-reading-types';
import { ReferralTierDoc } from '../../typings';

const referralTierDefinition: SameKeysAs<FilterAutoMongoKeys<ReferralTier>> = {
  tierNumber: { type: Number, required: true },
  title: { type: String, required: true },
  referralCount: { type: Number },
  badgeKey: { type: String },
  discordRole: { type: String },
};

const referralTierSchema = new Schema(referralTierDefinition, {
  _id: false,
});

const referralTiersDefinition: SameKeysAs<
  FilterAutoMongoKeys<ReferralTiers>
> = {
  tiers: { type: [referralTierSchema], required: true },
};

const referralTiersSchema = new Schema(referralTiersDefinition, {
  timestamps: true,
});

export default model<ReferralTierDoc>(
  'ReferralTier',
  referralTiersSchema,
  'referralTiers'
);
