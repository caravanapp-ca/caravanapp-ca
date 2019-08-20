import { REFERRAL_BADGE_KEYS } from './globalConstants';
import { UserBadge } from '@caravan/buddy-reading-types';

export const getBadgeToDisplay = (badges: UserBadge[] | undefined) => {
  if (!badges || badges.length === 0) {
    return undefined;
  }
  for (let i = 0; i < REFERRAL_BADGE_KEYS.length; i++) {
    const badge = badges.find(b => b.key === REFERRAL_BADGE_KEYS[i]);
    if (badge) {
      return badge;
    }
  }
  return undefined;
};
