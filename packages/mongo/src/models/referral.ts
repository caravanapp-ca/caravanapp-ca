import { Document, model, Schema, Types } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  Referral,
  UserReferredAction,
  ReferredUser,
  MongoTimestamps,
} from '@caravan/buddy-reading-types';

export interface ReferralDoc
  extends Document,
    MongoTimestamps,
    Omit<Referral, '_id'> {
  _id: Types.ObjectId;
}

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

export const ReferralModel = model<ReferralDoc>('Referral', referralSchema);