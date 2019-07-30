import { referralBadgeKeys } from '../common/globalConstants';
import { UserBadge } from '@caravan/buddy-reading-types';

export const getBadgeToDisplay = (badges: UserBadge[] | undefined) => {
  if (!badges || badges.length === 0) {
    return;
  }
  for (let i = 0; i < referralBadgeKeys.length; i++) {
    const badge = badges.find(b => b.key === referralBadgeKeys[i]);
    if (badge) {
      return badge;
    }
  }
  return;
};
