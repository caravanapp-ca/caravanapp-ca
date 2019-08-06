import SessionModel from '../models/session';
import { SessionDoc } from '../../typings';
import { DiscordPermissions } from '../common/globalConstantsAPI';

export const getSession = (userId: string) => {
  return SessionModel.findOne({ id: userId });
};

export const validateSessionPermissions = (session: SessionDoc) => {
  if (session.scope !== DiscordPermissions.join(' ')) {
    return false;
  } else {
    return true;
  }
};
