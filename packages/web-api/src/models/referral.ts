import { model, Schema } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  Referral,
  UserReferred,
  UserReferredAction,
} from '@caravan/buddy-reading-types';
import { ReferralDoc } from '../../typings';

const userReferredActionSchemaDefinition: SameKeysAs<
  FilterAutoMongoKeys<UserReferredAction>
> = {
  action: { type: String, required: true },
  timestamp: { type: Date, required: true },
};

const userReferredActionSchema = new Schema(
  userReferredActionSchemaDefinition,
  {
    _id: false,
  }
);

const referralDefinition: SameKeysAs<FilterAutoMongoKeys<Referral>> = {
  referredUsers: { type: [String], required: true, default: [] },
  // This id will change over time. Initially, when you're not signed up
  userId: { type: String, required: true, unique: true, index: true },
  actions: {
    type: [userReferredActionSchema],
    required: true,
    default: [],
  },
  referralCount: { type: Number, required: true, default: 0 },
  referredById: { type: String, index: true },
};

const referralSchema = new Schema<ReferralDoc>(referralDefinition, {
  timestamps: true,
});

export default model<ReferralDoc>('Referral', referralSchema);
