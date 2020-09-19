import type { Types } from 'mongoose';

import { SessionDoc, SessionModel } from '@caravanapp/mongo';
import type { OAuth2Client, SameKeysAs, Session } from '@caravanapp/types';

export const getSessionFromUserId = async (
  userId: Types.ObjectId,
  client: OAuth2Client
) => {
  const sessionQuery: Partial<SessionDoc> = {
    userId,
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
  const session = await SessionModel.findOne(sessionQuery);
  return session;
};
