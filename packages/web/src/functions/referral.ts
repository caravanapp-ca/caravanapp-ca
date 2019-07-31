import {
  ReferralSource,
  ReferralTiers,
  ReferralTier,
} from '@caravan/buddy-reading-types';

export const getReferralLink = (
  userId: string | undefined,
  location: 'home' | 'club',
  clubId?: string | undefined,
  source?: ReferralSource
) => {
  if (location) {
    // TODO: add more cases - should we parse URL?
    const refQuery = userId ? `?ref=${userId}` : '';
    const clubIdQuery = clubId ? `/${clubId}` : '';
    switch (location) {
      case 'home':
        return `https://${window.location.host}/clubs${refQuery}`;
      case 'club':
        return `https://${window.location.host}/clubs${clubIdQuery}${refQuery}`;
      default:
        return `https://${window.location.host}`;
    }
  } else {
    return `https://${window.location.host}`;
  }
};

export const getCurrReferralTier = (
  referralCount: number,
  referralTiers: ReferralTiers
) => {
  let currRefTier: ReferralTier | null = null;
  for (let i = 0; i < referralTiers.tiers.length; i++) {
    const refCount = referralTiers.tiers[i].referralCount;
    if (refCount != null) {
      if (refCount <= referralCount) {
        currRefTier = referralTiers.tiers[i];
      } else {
        return currRefTier;
      }
    }
  }
  return currRefTier;
};
