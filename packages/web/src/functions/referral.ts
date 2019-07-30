import {
  Referral,
  ReferralLocation,
  ReferralSource,
  ReferralTiers,
  ReferralTier,
} from '@caravan/buddy-reading-types';

export const getReferralLink = (
  userId: string | undefined,
  location: ReferralLocation,
  source?: ReferralSource
) => {
  if (userId) {
    if (location) {
      // TODO add more cases - should we parse URL?
      switch (location) {
        case 'home':
          return `https://${window.location.host}/clubs?ref=${userId}`;
        default:
          break;
      }
    }
  }
  return 'localhost:3000/clubs';
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
