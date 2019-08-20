import { SessionModel } from '@caravan/buddy-reading-mongo';

export const getSession = (userId: string) => {
  return SessionModel.findOne({ userId });
};
