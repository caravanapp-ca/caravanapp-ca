import { Document, model, Schema, Types } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  Session,
} from '@caravan/buddy-reading-types';

export interface SessionDoc extends Document, FilterAutoMongoKeys<Session> {
  _id: Types.ObjectId;
}

const definition: SameKeysAs<FilterAutoMongoKeys<Session>> = {
  accessToken: { type: String, required: true },
  accessTokenExpiresAt: { type: Number, required: true },
  refreshToken: { type: String, required: true },
  scope: { type: String, required: true },
  tokenType: { type: String, required: true },
  client: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
};

const sessionSchema = new Schema<SessionDoc>(definition);

export const SessionModel = model<SessionDoc>('Session', sessionSchema);
