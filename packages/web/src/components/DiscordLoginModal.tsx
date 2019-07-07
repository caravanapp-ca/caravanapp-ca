import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DiscordAuthButton from './DiscordAuthButton';

interface LoginModalProps {
  open: boolean;
  onCloseLoginDialog: () => void;
}

export default function DiscordLoginModal(props: LoginModalProps) {
  const theme = useTheme();
  const { onCloseLoginDialog, open } = props;

  return (
    <Dialog open={open} onClose={onCloseLoginDialog}>
      <DialogTitle color={theme.palette.primary.main} id="alert-dialog-title">
        Join our Community!
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This will allow you to join and create clubs. If it is your first
          time, it will also add you to the Caravan Clubs Discord server where
          all clubs are currently hosted. If you don't have Discord yet you can
          sign up by following the link below.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseLoginDialog} color="primary">
          Close
        </Button>
        <DiscordAuthButton />
      </DialogActions>
    </Dialog>
  );
}
