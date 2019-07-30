import { ReferralSource } from '@caravan/buddy-reading-types';

export default function getReferralLink(
  userId: string | undefined,
  location: 'home' | 'club',
  source?: ReferralSource
) {
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
}
