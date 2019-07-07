import React from 'react';
import {
  User,
  EditableUserField,
  Services,
  ProfileQuestion,
  UserQA,
} from '@caravan/buddy-reading-types';
import { Typography, makeStyles } from '@material-ui/core';
import UserReadingSpeed from './UserReadingSpeed';
import UserGenres from './UserGenres';
import UserQuestions from './UserQuestions';
import clsx from 'clsx';
import { UserQAwMinMax } from './User';

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
  userIsMe: boolean;
  isEditing: boolean;
  onEdit: (field: EditableUserField, newValue: any) => void;
  genres?: Services.GetGenres;
  initQuestions?: {
    initAnsweredQs: UserQAwMinMax[];
    initUnansweredQs: ProfileQuestion[];
  };
  userQuestionsWkspc: UserQA[];
}

export default function UserBio(props: UserBioProps) {
  const {
    user,
    userIsMe,
    isEditing,
    onEdit,
    genres,
    initQuestions,
    userQuestionsWkspc,
  } = props;
  const classes = useStyles();

  return (
    <>
      <div className={classes.sectionContainer}>
        <Typography variant="h6" className={classes.sectionLabel}>
          Reading Speed
        </Typography>
        <UserReadingSpeed
          user={user}
          userIsMe={userIsMe}
          isEditing={isEditing}
          onEdit={onEdit}
        />
      </div>
      <div className={classes.sectionContainer}>
        <Typography variant="h6" className={classes.sectionLabel}>
          Genres
        </Typography>
        <UserGenres
          user={user}
          userIsMe={userIsMe}
          isEditing={isEditing}
          onEdit={onEdit}
          genres={genres || undefined}
        />
      </div>
      <div
        className={clsx(classes.sectionContainer, classes.sectionContainerEnd)}
      >
        <Typography variant="h6" className={classes.sectionLabel}>
          {'Q & A'}
        </Typography>
        <UserQuestions
          user={user}
          userIsMe={userIsMe}
          numQuestionsToPreview={4}
          isEditing={isEditing}
          onEdit={onEdit}
          initQuestions={initQuestions}
          userQuestionsWkspc={userQuestionsWkspc}
        />
      </div>
    </>
  );
}
