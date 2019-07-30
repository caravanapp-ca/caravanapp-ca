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
    // TODO add more cases - should we parse URL?
    switch (location) {
      case 'home':
        if (userId) {
          return `https://${window.location.host}/clubs?ref=${userId}`;
        } else {
          return `https://${window.location.host}/clubs`;
        }

      case 'club':
        if (clubId && userId) {
          return `https://${
            window.location.host
          }/clubs/${clubId}?ref=${userId}`;
        } else if (clubId) {
          return `https://${window.location.host}/clubs/${clubId}`;
        } else if (userId) {
          return `https://${window.location.host}/clubs?ref=${userId}`;
        } else {
          return `https://${window.location.host}/clubs`;
        }

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
