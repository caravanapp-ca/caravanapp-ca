import { makeStyles, Button, Typography } from '@material-ui/core';
import React from 'react';
import { User } from '@caravan/buddy-reading-types';
import { washedTheme } from '../theme';
import AdapterLink from './AdapterLink';
import marioIcon from '../resources/mario-icon.png';

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
      to={{
        pathname: `/user/${user.urlSlug}`,
        state: { tabValue: 1 },
      }}
      variant="contained"
    >
      <img src={marioIcon} alt="Mario logo" className={classes.marioIcon} />
      <Typography variant="button">It's-A-Me!</Typography>
    </Button>
  );
}
