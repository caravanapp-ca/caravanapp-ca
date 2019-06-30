import React from 'react';
import {
  User,
  UserShelfEntry,
  ReadingState,
} from '@caravan/buddy-reading-types';
import { Typography, makeStyles } from '@material-ui/core';
import BookList from '../club/shelf-view/BookList';
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

type UserShelfType = { [K in ReadingState]: UserShelfEntry[] };

interface UserShelfProps {
  user: User;
  shelf: UserShelfType;
}

export default function UserShelf(props: UserShelfProps) {
  const classes = useStyles();
  const { user, shelf } = props;
  return (
    <div>
      {shelf.current.length > 0 && (
        <div className={classes.sectionContainer}>
          <Typography variant="h6" className={classes.sectionLabel}>
            Currently Reading
          </Typography>
          <BookList data={shelf.current} />
        </div>
      )}
      {shelf.notStarted.length > 0 && (
        <div className={classes.sectionContainer}>
          <Typography variant="h6" className={classes.sectionLabel}>
            Wants to Read
          </Typography>
          <BookList data={shelf.notStarted} />
        </div>
      )}
      {shelf.notStarted.length > 0 && (
        <div
          className={clsx(
            classes.sectionContainer,
            classes.sectionContainerEnd
          )}
        >
          <Typography variant="h6" className={classes.sectionLabel}>
            Previously Read
          </Typography>
          <BookList data={shelf.read} />
        </div>
      )}
    </div>
  );
}
