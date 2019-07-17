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
        Meet great people, read amazing books.
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Logging in allows you to join and create clubs. You will be added to
          the Caravan Clubs Discord server where all clubs are currently hosted.
          If you don't have Discord yet you can sign up by following the link
          below.
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
