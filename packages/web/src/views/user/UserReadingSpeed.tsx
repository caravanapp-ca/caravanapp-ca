import React from 'react';
import { User, ReadingSpeed } from '@caravan/buddy-reading-types';
import ListElementAvatar from '../../components/ListElementAvatar';
import {
  readingSpeedIcons,
  readingSpeedLabels,
} from '../../components/reading-speed-avatars-icons-labels';

interface UserReadingSpeedProps {
  user: User;
}

export default function UserReadingSpeed(props: UserReadingSpeedProps) {
  const { user } = props;
  return (
    <ListElementAvatar
      avatarElement={readingSpeedIcons(
        user.readingSpeed as ReadingSpeed,
        'avatar'
      )}
      primaryText={readingSpeedLabels(user.readingSpeed as ReadingSpeed)}
      secondaryText={readingSpeedLabels(
        user.readingSpeed as ReadingSpeed,
        'description'
      )}
    />
  );
}
