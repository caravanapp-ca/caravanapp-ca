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
  onEdit: (field: EditableUserField, newValue: any) => void;
}

export default function UserShelf(props: UserShelfProps) {
  const classes = useStyles();
  const { user, shelf, isEditing, onEdit } = props;
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
          {(!isEditing || !onEdit) && <BookList data={shelf.notStarted} />}
          {isEditing && onEdit && (
            <UserShelfEditable
              user={user}
              shelf={shelf}
              isEditing={isEditing}
              onEdit={onEdit}
            />
          )}
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
