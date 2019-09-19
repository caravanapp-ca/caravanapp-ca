import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { errorTheme } from '../theme';
import { MuiThemeProvider } from '@material-ui/core/styles';

interface DeletePostDialogProps {
  open: boolean;
  onDelete: () => void;
  onCancel: () => void;
}

export default function DeletePostDialog(props: DeletePostDialogProps) {
  const { open, onDelete, onCancel } = props;

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Are you sure you want to delete this shelf?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This will remove this shelf from the website. This cannot be undone.
          If you just want to change the shelf, edit it instead.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary" autoFocus>
          Cancel
        </Button>
        <MuiThemeProvider theme={errorTheme}>
          <Button onClick={onDelete} color="primary">
            Delete
          </Button>
        </MuiThemeProvider>
      </DialogActions>
    </Dialog>
  );
}
