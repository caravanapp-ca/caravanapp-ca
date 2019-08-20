import React, { useEffect } from 'react';
import {
  UserShelfType,
  ShelfEntry,
  UserShelfEntry,
  FilterAutoMongoKeys,
} from '@caravan/buddy-reading-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import BookSearch from '../books/BookSearch';
import BookList from '../club/shelf-view/BookList';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { errorTheme } from '../../theme';

interface UserShelfEditableProps {
  readingState: 'notStarted' | 'read';
  shelf: UserShelfType;
  onEdit: (field: 'shelf', newValue: UserShelfType) => void;
}

export default function UserShelfEditable(props: UserShelfEditableProps) {
  const { readingState, shelf, onEdit } = props;
  const [alertDialogOpen, setAlertDialogOpen] = React.useState<boolean>(false);
  const [deleteIndexHold, setDeleteIndexHold] = React.useState<number>(-1);

  useEffect(() => {
    if (deleteIndexHold >= 0) {
      setAlertDialogOpen(true);
    }
  }, [deleteIndexHold]);

  const onSubmitBooks = (
    selectedBooks: (ShelfEntry | FilterAutoMongoKeys<ShelfEntry>)[],
    bookToRead: ShelfEntry | FilterAutoMongoKeys<ShelfEntry> | null
  ) => {
    const shelfCopy = {
      ...shelf,
      [readingState]: selectedBooks as FilterAutoMongoKeys<UserShelfEntry>[],
    };
    onEdit('shelf', shelfCopy);
  };

  const openAlertDialog = (id: string, index: number) => {
    setDeleteIndexHold(index);
  };

  const onDeleteRead = () => {
    if (deleteIndexHold >= 0) {
      const newRead = [...shelf[readingState]];
      newRead.splice(deleteIndexHold, 1);
      const shelfCopy = { ...shelf, [readingState]: newRead };
      onEdit('shelf', shelfCopy);
    }
    setDeleteIndexHold(-1);
    setAlertDialogOpen(false);
  };

  return (
    <div>
      {readingState === 'notStarted' && (
        <BookSearch
          secondary="delete"
          onSubmitBooks={onSubmitBooks}
          initialSelectedBooks={shelf[readingState]}
        />
      )}
      {readingState === 'read' && (
        <BookList
          id="previously-read-editable"
          data={shelf[readingState]}
          secondary="delete"
          tertiary="buy"
          onDelete={openAlertDialog}
        />
      )}
      <Dialog open={alertDialogOpen} onClose={() => setAlertDialogOpen(false)}>
        <DialogTitle id="alert-dialog-title">
          Remove finished book from shelf?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove this previously finished book from
            your shelf? Books are only added to this section of your shelf when
            you finish them with a club. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <MuiThemeProvider theme={errorTheme}>
            <Button onClick={() => onDeleteRead()} color="primary" autoFocus>
              Remove
            </Button>
          </MuiThemeProvider>
        </DialogActions>
      </Dialog>
    </div>
  );
}
