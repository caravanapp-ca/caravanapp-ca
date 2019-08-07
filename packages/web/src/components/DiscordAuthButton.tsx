import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import { getDiscordAuthUrl } from '../common/auth';

export interface DiscordAuthButtonProps {}

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  leftIcon: {
    color: 'white',
    marginRight: theme.spacing(1),
  },
}));

function onClick() {
  const discordAuthUrl = getDiscordAuthUrl();
  window.location.href = discordAuthUrl;
}

export default function DiscordAuthButton(props: DiscordAuthButtonProps) {
  const classes = useStyles();
  return (
    <Button
      variant="contained"
      color="primary"
      className={classes.button}
      onClick={onClick}
    >
      <LockIcon className={classes.leftIcon} />
      Login with Discord
    </Button>
  );
}
