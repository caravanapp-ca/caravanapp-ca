import { ReferralTiers, ReferralTier } from '@caravan/buddy-reading-types';

export const getReferralLink = (
  userId: string | undefined,
  location: 'home' | 'profile' | 'club' | 'post',
  clubId?: string,
  postId?: string
) => {
  if (location) {
    // TODO: add more cases - should we parse URL?
    const refQuery = userId ? `?ref=${userId}` : '';
    const clubIdQuery = clubId ? `/${clubId}` : '';
    const postIdQuery = postId ? `/${postId}` : '';
    switch (location) {
      case 'home':
        const homeSourceParam = 'utm_source=cph';
        let urlHomeParam = '';
        if (refQuery !== '') {
          urlHomeParam = refQuery + '&' + homeSourceParam;
        } else {
          urlHomeParam = '?' + homeSourceParam;
        }
        return `https://${window.location.host}/clubs${urlHomeParam}`;
      case 'profile':
        const profileSourceParam = 'utm_source=cpp';
        let urlProfileParam = '';
        if (refQuery !== '') {
          urlProfileParam = refQuery + '&' + profileSourceParam;
        } else {
          urlProfileParam = '?' + profileSourceParam;
        }
        return `https://${window.location.host}/clubs${urlProfileParam}`;
      case 'club':
        const clubSourceParam = 'utm_source=cpc';
        let urlClubParam = '';
        if (refQuery !== '') {
          urlClubParam = refQuery + '&' + clubSourceParam;
        } else {
          urlClubParam = '?' + clubSourceParam;
        }
        return `https://${window.location.host}/clubs${clubIdQuery}${urlClubParam}`;
      case 'post':
        const postSourceParam = 'utm_source=sp';
        let urlPostParam = '';
        if (refQuery !== '') {
          urlPostParam = refQuery + '&' + postSourceParam;
        } else {
          urlPostParam = '?' + postSourceParam;
        }
        return `https://${window.location.host}/post${postIdQuery}${urlPostParam}`;
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
