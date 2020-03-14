import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MuiThemeProvider,
} from '@material-ui/core';

import { errorTheme } from '../../theme';

interface ClubDisbandDialogProps {
  open: boolean;
  onDisbandSelect: () => void;
  onCancel: () => void;
}

export default function ClubDisbandDialog(props: ClubDisbandDialogProps) {
  const { open, onDisbandSelect, onCancel } = props;

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Are you sure you want to disband your club?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This will remove your club from the website and delete all chat. This
          cannot be undone. Chat will be permanently deleted so please save
          important information before disbanding.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary" autoFocus>
          Cancel
        </Button>
        <MuiThemeProvider theme={errorTheme}>
          <Button onClick={onDisbandSelect} color="primary">
            Yes, disband my club
          </Button>
        </MuiThemeProvider>
      </DialogActions>
    </Dialog>
  );
}
