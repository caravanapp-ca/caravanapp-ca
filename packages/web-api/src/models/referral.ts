import { model, Schema } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  Referral,
  UserReferredAction,
  ReferredUser,
  ReferralDestination,
} from '@caravan/buddy-reading-types';
import { ReferralDoc } from '../../typings';
import { ALLOWED_REFERRAL_DESTINATIONS } from '../services/referral';

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

const userReferredDefinition: SameKeysAs<FilterAutoMongoKeys<ReferredUser>> = {
  referredUserId: { type: String, required: true },
  timestamp: { type: Date, required: true },
};

const userReferredSchema = new Schema(userReferredDefinition, {
  _id: false,
});

const referralDefinition: SameKeysAs<FilterAutoMongoKeys<Referral>> = {
  referredUsers: { type: [userReferredSchema], required: true, default: [] },
  // This id will change over time. Initially, when you're not signed up
  userId: { type: String, required: true, unique: true, index: true },
  actions: {
    type: [userReferredActionSchema],
    required: true,
    default: [],
  },
  referralCount: { type: Number, required: true, default: 0 },
  referredById: { type: String, index: true },
  referredAndNotJoined: { type: Boolean, default: false },
  source: { type: String },
  referralDestination: {
    type: String,
    required: true,
    default: 'home',
  },
};

const referralSchema = new Schema<ReferralDoc>(referralDefinition, {
  timestamps: true,
});

export default model<ReferralDoc>('Referral', referralSchema);
