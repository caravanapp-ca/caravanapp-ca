import React from 'react';

import { Avatar, createStyles, makeStyles, Theme } from '@material-ui/core';

import { washedTheme } from '../../../theme';
import FirstTimersGroupVibeIcon from '../group-vibe-icons/FirstTimersGroupVibeIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    colorDefault: {
      backgroundColor: washedTheme.palette.primary.main,
    },
  })
);

export default function FirstTimersGroupVibeAvatar() {
  const classes = useStyles();
  return (
    <Avatar classes={{ colorDefault: classes.colorDefault }}>
      <FirstTimersGroupVibeIcon color="primary" />
    </Avatar>
  );
}
