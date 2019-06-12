import axios from 'axios';
import React from 'react';
import { LinkProps, Link } from 'react-router-dom';
import { Button, makeStyles } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';

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

// required for react-router-dom < 6.0.0
// see https://github.com/ReactTraining/react-router/issues/6056#issuecomment-435524678
const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => <Link innerRef={ref} {...props} />
);

export default function DiscordAuthButton(props: DiscordAuthButtonProps) {
  const classes = useStyles();
  const req = async () => {
    await axios.get('/api/auth/discord/login');
  }
  return (
    <>
      <Button
        variant="contained"
        className={classes.button}
        onClick={req}
      >
        <LockIcon className={classes.leftIcon} />
        Login with Discord
      </Button>
    </>
  );
}
