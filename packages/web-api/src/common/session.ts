import type { SessionDoc } from '@caravanapp/mongo';
import { DISCORD_PERMISSIONS } from '../common/globalConstantsAPI';

export const validateSessionPermissions = (session: SessionDoc) => {
  const scopes = new Set(session.scope.split(' '));
  return DISCORD_PERMISSIONS.every(p => scopes.has(p));
};
