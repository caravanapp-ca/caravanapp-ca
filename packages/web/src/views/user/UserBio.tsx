import React from 'react';
import { User } from '@caravan/buddy-reading-types';
import { Typography, Button, makeStyles } from '@material-ui/core';
import UserReadingSpeed from './UserReadingSpeed';
import UserGenres from './UserGenres';
import UserQuestions from './UserQuestions';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  sectionContainer: {
    marginTop: theme.spacing(3),
  },
  sectionContainerEnd: {
    marginBottom: theme.spacing(3),
  },
  sectionLabel: {
    marginBottom: theme.spacing(1),
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
      <div className={classes.sectionContainer}>
        <Typography variant="h6" className={classes.sectionLabel}>
          Reading Speed
        </Typography>
        <UserReadingSpeed user={user} />
      </div>
      <div className={classes.sectionContainer}>
        <Typography variant="h6" className={classes.sectionLabel}>
          Genres
        </Typography>
        <UserGenres user={user} />
      </div>
      <div
        className={clsx(classes.sectionContainer, classes.sectionContainerEnd)}
      >
        <Typography variant="h6" className={classes.sectionLabel}>
          {'Q & A'}
        </Typography>
        <UserQuestions user={user} numQuestionsToPreview={4} />
      </div>
    </>
  );
}
