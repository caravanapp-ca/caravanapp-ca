import SessionModel from '../models/session';

export const getSessionFromUserId = async (userId: string) => {
  const sessions = await SessionModel.find({ userId });
  const currentSession = sessions.pop();
  return currentSession;
};

export const getSession = async (accessToken: string) => {
  const session = await SessionModel.findOne({ accessToken });
  return session;
};
