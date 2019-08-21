import mongoose from 'mongoose';
import {
  OAuth2Client,
  SameKeysAs,
  Session,
} from '@caravan/buddy-reading-types';
import { SessionDoc, SessionModel } from '@caravan/buddy-reading-mongo';

export const getSessionFromUserId = async (
  userId: string,
  client: OAuth2Client
) => {
  const userObjectId = mongoose.Types.ObjectId(userId);
  const sessionQuery: Partial<SessionDoc> = {
    userId: userObjectId,
    client,
  };
  const sessionSort: SameKeysAs<Partial<SessionDoc>> = {
    accessTokenExpiresAt: -1,
  };
  const sessionDocs = await SessionModel.find(sessionQuery)
    .sort(sessionSort)
    .limit(1);
  const sessionDoc =
    Array.isArray(sessionDocs) && sessionDocs.length > 0
      ? sessionDocs[0]
      : null;
  return sessionDoc;
};

export const getSession = async (accessToken: string) => {
  const sessionQuery: Partial<Session> = {
    accessToken,
  };
  const session = await SessionModel.findOne({ sessionQuery });
  return session;
};
