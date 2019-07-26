import { ReferralSource, ReferralLocation } from '@caravan/buddy-reading-types';

export default function getReferralLink(
  userId: string,
  location: ReferralLocation,
  source?: ReferralSource
) {
  if (userId) {
    if (location) {
      // TODO add more cases - should we parse URL?
      switch (location) {
        case 'profile':
          return 'localhost:3000/clubs?ref=' + userId;
        default:
          break;
      }
    }
  }
  return window.location.href;
}
