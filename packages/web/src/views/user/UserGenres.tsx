import React from 'react';
import { User } from '@caravan/buddy-reading-types';
import GenreChip from '../../components/GenreChip';
import { makeStyles } from '@material-ui/core';

interface UserGenresProps {
  user: User;
}

const useStyles = makeStyles(theme => ({
  genresContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
}));

export default function UserGenres(props: UserGenresProps) {
  const classes = useStyles();
  const { user } = props;
  return (
    <div className={classes.genresContainer}>
      {user.selectedGenres.map(g => (
        <GenreChip key={g.key} name={g.name} active={false} />
      ))}
    </div>
  );
}
