import React from 'react';
import {
  User,
  EditableUserField,
  UserShelfType,
} from '@caravan/buddy-reading-types';
import { Typography, makeStyles } from '@material-ui/core';
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
  shelf: UserShelfType;
  isEditing: boolean;
  onEdit: (field: 'shelf', newValue: any) => void;
}

export default function UserShelf(props: UserShelfProps) {
  const classes = useStyles();
  const { user, shelf, isEditing, onEdit } = props;
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
          <BookList data={shelf.current} />
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
            Wants to Read
          </Typography>
          {(!isEditing || !onEdit) && <BookList data={shelf.notStarted} />}
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
          {(!isEditing || !onEdit) && <BookList data={shelf.read} />}
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
