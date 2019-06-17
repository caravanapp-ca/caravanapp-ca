import { model, Schema } from 'mongoose';
import {
  FilterAutoMongoKeys,
  SameKeysAs,
  SessionDoc,
} from '@caravan/buddy-reading-types';

const definition: SameKeysAs<FilterAutoMongoKeys<SessionDoc>> = {
  accessToken: { type: String, required: true },
  accessTokenExpiresAt: { type: Number, required: true },
  refreshToken: { type: String, required: true },
  scope: { type: String, required: true },
  tokenType: { type: String, required: true },
  client: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
};

const sessionSchema = new Schema<SessionDoc>(definition);

export default model<SessionDoc>('Session', sessionSchema);
