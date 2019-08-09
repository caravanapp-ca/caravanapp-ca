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
  referralCount: { type: Number, required: true },
  title: { type: String, required: true },
  badgeKey: { type: String },
  discordRole: { type: String },
  profileBgSet: { type: String },
};

const referralTiersDefinition: SameKeysAs<
  FilterAutoMongoKeys<ReferralTiers>
> = {
  tiers: { type: [referralTierDefinition], required: true },
};

const referralTiersSchema = new Schema(referralTiersDefinition);

export default model<ReferralTierDoc>(
  'ReferralTier',
  referralTiersSchema,
  'referralTiers'
);
