import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import { authorizeDiscordJoin } from '../services/auth';

export interface DiscordAuthButtonProps {}

const useStyles = makeStyles(theme => ({
  button: {
    'background-color': '#7289da',
    color: 'white',
    margin: theme.spacing(1),
  },
  leftIcon: {
    color: 'white',
    marginRight: theme.spacing(1),
  },
}));

export default function DiscordAuthorizeButton(props: DiscordAuthButtonProps) {
  const classes = useStyles();
  function onClick() {
    authorizeDiscordJoin();
  }
  return (
    <Button variant="contained" className={classes.button} onClick={onClick}>
      <LockIcon className={classes.leftIcon} />
      Authorize Discord
    </Button>
  );
}
