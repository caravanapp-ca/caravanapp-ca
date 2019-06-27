import React from 'react';
import { User, ReadingSpeed } from '@caravan/buddy-reading-types';
import { Typography, Link } from '@material-ui/core';
import ListElementAvatar from '../../components/ListElementAvatar';
import {
  readingSpeedIcons,
  readingSpeedLabels,
} from '../../components/reading-speed-avatars-icons-labels';

interface UserBioProps {
  user: User;
}

export default function UserBio(props: UserBioProps) {
  const { user } = props;

  return (
    <>
      <Typography variant="h6">Bio</Typography>
      <Typography variant="body1">{user.bio}</Typography>
      <Typography variant="body1">
        <Link href={user.website}>{user.website}</Link>
      </Typography>
      <Typography variant="h6">Reading Speed</Typography>
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
      <Typography variant="h6">Genres</Typography>
      <Typography variant="h6">{`Get to know ${user.name}`}</Typography>
    </>
  );
}
