import React from 'react';
import { User } from '@caravan/buddy-reading-types';
import { Typography, Button, makeStyles } from '@material-ui/core';
import UserReadingSpeed from './UserReadingSpeed';
import UserGenres from './UserGenres';
import UserQuestions from './UserQuestions';

const useStyles = makeStyles(theme => ({}));

interface UserBioProps {
  user: User;
}

export default function UserBio(props: UserBioProps) {
  const { user } = props;
  const classes = useStyles();

  return (
    <>
      <Typography variant="h6">Reading Speed</Typography>
      <UserReadingSpeed user={user} />
      <Typography variant="h6">Genres</Typography>
      <UserGenres user={user} />
      <Typography variant="h6">{'Q & A'}</Typography>
      <UserQuestions user={user} />
    </>
  );
}
