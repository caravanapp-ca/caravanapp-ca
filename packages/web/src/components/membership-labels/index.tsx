import { Membership } from '@caravan/buddy-reading-types';

export function membershipLabels(
  membership: Membership,
  type?: 'description'
): string {
  switch (membership) {
    case 'myClubs':
      if (type === 'description') {
        return "Clubs that I'm a part of";
      }
      return 'My clubs';
    case 'clubsImNotIn':
      if (type === 'description') {
        return "Clubs I'm not a part of";
      }
      return "Clubs I'm not in";
  }
}
