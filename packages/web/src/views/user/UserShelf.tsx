import React from 'react';
import { User, UserShelfType } from '@caravan/buddy-reading-types';
import { Typography, makeStyles, useTheme, Container } from '@material-ui/core';
import BookList from '../club/shelf-view/BookList';
import clsx from 'clsx';
import UserShelfEditable from './UserShelfEditable';

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

interface UserShelfProps {
  user: User;
  userIsMe: boolean;
  shelf: UserShelfType;
  isEditing: boolean;
  onEdit: (field: 'shelf', newValue: any) => void;
}

export default function UserShelf(props: UserShelfProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { user, userIsMe, shelf, isEditing, onEdit } = props;
  if (
    user &&
    !isEditing &&
    shelf.current.length + shelf.notStarted.length + shelf.read.length === 0
  ) {
    let noShelfMessage =
      'This user has not yet added any books to their shelf.';
    if (userIsMe) {
      noShelfMessage =
        'Aghast! Your shelf is empty! Click edit in the top right to save yourself from this embarrassment!';
    }
    return (
      <Container maxWidth="md">
        <Typography
          color="textSecondary"
          style={{
            textAlign: 'center',
            fontStyle: 'italic',
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(4),
          }}
        >
          {noShelfMessage}
        </Typography>
      </Container>
    );
  }
  return (
    <div>
      {shelf.current.length > 0 && (
        <div
          className={
            shelf.notStarted.length > 0
              ? classes.sectionContainer
              : clsx(classes.sectionContainer, classes.sectionContainerEnd)
          }
        >
          <Typography variant="h6" className={classes.sectionLabel}>
            Currently Reading
          </Typography>
          <BookList id="current" data={shelf.current} tertiary="buy" />
        </div>
      )}
      {shelf.notStarted.length > 0 && (
        <div
          className={
            shelf.read.length > 0
              ? classes.sectionContainer
              : clsx(classes.sectionContainer, classes.sectionContainerEnd)
          }
        >
          <Typography variant="h6" className={classes.sectionLabel}>
            To be Read
          </Typography>
          {(!isEditing || !onEdit) && (
            <BookList id="to-be-read" data={shelf.notStarted} tertiary="buy" />
          )}
        </div>
      )}
      {isEditing && onEdit && (
        <div
          className={
            shelf.read.length > 0
              ? classes.sectionContainer
              : clsx(classes.sectionContainer, classes.sectionContainerEnd)
          }
        >
          {shelf.notStarted.length === 0 && (
            <Typography variant="h6" className={classes.sectionLabel}>
              Wants to Read
            </Typography>
          )}
          <UserShelfEditable
            readingState={'notStarted'}
            shelf={shelf}
            onEdit={onEdit}
          />
        </div>
      )}
      {shelf.read.length > 0 && (
        <div
          className={clsx(
            classes.sectionContainer,
            classes.sectionContainerEnd
          )}
        >
          <Typography variant="h6" className={classes.sectionLabel}>
            Previously Read
          </Typography>
          {(!isEditing || !onEdit) && (
            <BookList id="previously-read" data={shelf.read} />
          )}
          {isEditing && onEdit && (
            <UserShelfEditable
              readingState={'read'}
              shelf={shelf}
              onEdit={onEdit}
            />
          )}
        </div>
      )}
    </div>
  );
}
