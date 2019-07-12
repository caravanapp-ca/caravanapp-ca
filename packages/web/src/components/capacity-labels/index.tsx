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
      return 'Available';
  }
}
