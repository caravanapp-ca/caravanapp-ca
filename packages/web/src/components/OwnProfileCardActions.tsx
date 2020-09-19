import React from 'react';

import type { User } from '@caravanapp/types';
import { Button, makeStyles, Typography } from '@material-ui/core';

import marioIcon from '../resources/mario-icon.png';
import { washedTheme } from '../theme';
import AdapterLink from './AdapterLink';

const useStyles = makeStyles(theme => ({
  headerAvatar: {
    width: 48,
    height: 48,
  },
  headerArrowDown: {
    height: 20,
    width: 20,
  },
  profileIconCircle: {
    backgroundColor: washedTheme.palette.primary.main,
  },
  button: {
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  marioIcon: {
    height: 24,
    resizeMode: 'contain',
    paddingRight: theme.spacing(1),
  },
}));

interface OwnProfileCardActionsProps {
  user: User;
}

export function OwnProfileCardActions(props: OwnProfileCardActionsProps) {
  const classes = useStyles();

  const { user } = props;

  return (
    <Button
      className={classes.button}
      color="primary"
      component={AdapterLink}
      to={`/user/${user.urlSlug}`}
      variant="contained"
    >
      <img src={marioIcon} alt="Mario logo" className={classes.marioIcon} />
      <Typography variant="button">It's-A-Me!</Typography>
    </Button>
  );
}
