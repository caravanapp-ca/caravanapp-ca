import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
} from '@material-ui/core';

interface DownloadDiscordDialogProps {
  open: boolean;
  handleClose?: () => void;
}

export default function DownloadDiscordDialog(
  props: DownloadDiscordDialogProps
) {
  const { open, handleClose } = props;
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="download-discord-title"
      aria-describedby="download-discord-body"
    >
      <DialogTitle id="download-discord-title">Get the Discord App</DialogTitle>
      <DialogContent>
        <DialogContentText id="download-discord-body">
          We strongly recommend you download the Discord app for the best
          Caravan experience. This will provide a smoother chat experience and
          allow you to receive notifications for activity in your clubs. Use the
          link below to download Discord for mobile and/or desktop.
        </DialogContentText>
        <Link variant="h6" href="https://discord.com/download" target="_blank">
          Download Discord
        </Link>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
