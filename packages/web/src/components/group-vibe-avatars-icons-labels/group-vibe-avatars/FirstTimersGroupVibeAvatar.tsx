import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import FirstTimersGroupVibeIcon from '../group-vibe-icons/FirstTimersGroupVibeIcon';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { washedTheme } from '../../../theme';

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
