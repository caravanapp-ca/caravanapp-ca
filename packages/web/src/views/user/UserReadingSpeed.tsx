import React from 'react';
import { User, ReadingSpeed } from '@caravan/buddy-reading-types';
import ListElementAvatar from '../../components/ListElementAvatar';
import {
  readingSpeedIcons,
  readingSpeedLabels,
} from '../../components/reading-speed-avatars-icons-labels';
import { Radio, Typography } from '@material-ui/core';

interface UserReadingSpeedProps {
  user: User;
  userIsMe: boolean;
  isEditing: boolean;
  onEdit: (key: 'readingSpeed', newValue: ReadingSpeed) => void;
}

export default function UserReadingSpeed(props: UserReadingSpeedProps) {
  const { user, userIsMe, isEditing, onEdit } = props;
  const readingSpeeds: ReadingSpeed[] = ['fast', 'moderate', 'slow'];

  if (user && !isEditing && !user.readingSpeed) {
    let noRSMessage = 'This user has not yet specified their reading speed';
    if (userIsMe) {
      noRSMessage =
        "You haven't specified your reading speed yet! Click edit in the top right... at your own pace.";
    }
    return (
      <Typography color="textSecondary" style={{ fontStyle: 'italic' }}>
        {noRSMessage}
      </Typography>
    );
  }

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
