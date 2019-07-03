import React from 'react';
import { User, ReadingSpeed } from '@caravan/buddy-reading-types';
import ListElementAvatar from '../../components/ListElementAvatar';
import {
  readingSpeedIcons,
  readingSpeedLabels,
} from '../../components/reading-speed-avatars-icons-labels';
import { Radio } from '@material-ui/core';

interface UserReadingSpeedProps {
  user: User;
  isEditing: boolean;
  onEdit: (key: 'readingSpeed', newValue: ReadingSpeed) => void;
}

export default function UserReadingSpeed(props: UserReadingSpeedProps) {
  const { user, isEditing, onEdit } = props;
  const readingSpeeds: ReadingSpeed[] = ['fast', 'moderate', 'slow'];
  if (isEditing && onEdit) {
    const elements = readingSpeeds.map(speed => (
      <ListElementAvatar
        key={speed}
        primaryElement={
          <Radio
            checked={user.readingSpeed === speed}
            onChange={() => onEdit('readingSpeed', speed)}
            value={speed}
            name={`radio-button-${speed}`}
            color="primary"
          />
        }
        avatarElement={readingSpeedIcons(speed, 'avatar')}
        primaryText={readingSpeedLabels(speed)}
        secondaryText={readingSpeedLabels(speed, 'description')}
      />
    ));
    const res = <>{elements}</>;
    return res;
  } else {
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
}
