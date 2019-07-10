import React from 'react';
import { Capacity } from '@caravan/buddy-reading-types';

export function capacityLabels(
  capacity: Capacity,
  type?: 'description'
): string {
  switch (capacity) {
    case 'full':
      if (type === 'description') {
        return 'Clubs with no spots available';
      }
      return 'Full';
    case 'spotsAvailable':
      if (type === 'description') {
        return 'Clubs with spots available';
      }
      return 'Spots Available';
    case 'clubsImIn':
      if (type === 'description') {
        return "Clubs I'm a part of but don't own";
      }
      return 'Member';
    case 'clubsIOwn':
      if (type === 'description') {
        return 'Clubs I own';
      }
      return 'Owner';
  }
}
