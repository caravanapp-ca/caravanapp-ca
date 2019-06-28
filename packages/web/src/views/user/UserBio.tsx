import React from 'react';
import { User, ReadingSpeed } from '@caravan/buddy-reading-types';
import { Typography, Button, makeStyles } from '@material-ui/core';
import ListElementAvatar from '../../components/ListElementAvatar';
import {
  readingSpeedIcons,
  readingSpeedLabels,
} from '../../components/reading-speed-avatars-icons-labels';
import GenreChip from '../../components/GenreChip';

const useStyles = makeStyles(theme => ({
  genresContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

interface UserBioProps {
  user: User;
}

export default function UserBio(props: UserBioProps) {
  const { user } = props;
  const classes = useStyles();

  return (
    <>
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
      <div className={classes.genresContainer}>
        {user.selectedGenres.map(g => (
          <GenreChip key={g.key} name={g.name} active={false} />
        ))}
      </div>
      <Typography variant="h6">{`Get to know ${user.name}`}</Typography>
    </>
  );
}
