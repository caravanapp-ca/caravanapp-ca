import SessionModel from '../models/session';
import { SessionDoc } from '../../typings';
import { DiscordPermissions } from '../common/globalConstantsAPI';

export const getSession = (userId: string) => {
  return SessionModel.findOne({ userId });
};

export const validateSessionPermissions = (session: SessionDoc) => {
  const discordPermissions = DiscordPermissions.join(' ');
  if (session.scope !== discordPermissions) {
    return false;
  } else {
    return true;
  }
};
