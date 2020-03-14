import { SessionDoc } from '@caravanapp/mongo';

import { DISCORD_PERMISSIONS } from '../common/globalConstantsAPI';

export const validateSessionPermissions = (session: SessionDoc) => {
  const discordPermissions = DISCORD_PERMISSIONS.join(' ');
  return session.scope === discordPermissions;
};
