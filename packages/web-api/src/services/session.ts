import SessionModel from '../models/session';
import { SessionDoc } from '../../typings';
import { DISCORD_PERMISSIONS } from '../common/globalConstantsAPI';

export const getSession = (userId: string) => {
  return SessionModel.findOne({ userId });
};

export const validateSessionPermissions = (session: SessionDoc) => {
  const discordPermissions = DISCORD_PERMISSIONS.join(' ');
  if (session.scope !== discordPermissions) {
    return false;
  } else {
    return true;
  }
};
