import SessionModel from '../models/session';

export const getSession = (userId: string) => {
  return SessionModel.findOne({ userId });
};
