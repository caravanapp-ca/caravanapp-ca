import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import { getOAuth2StateParam } from '../common/auth';

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
  const oauth2State = getOAuth2StateParam();
  const host =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '';
  window.location.href = `${host}/api/auth/discord/login?state=${oauth2State}`;
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
