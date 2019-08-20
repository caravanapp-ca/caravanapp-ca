import SessionModel from '../models/session';

export const getSession = async (userId: string) => {
  const sessions = await SessionModel.find({ userId });
  const currentSession = sessions.pop();
  return currentSession;
};
