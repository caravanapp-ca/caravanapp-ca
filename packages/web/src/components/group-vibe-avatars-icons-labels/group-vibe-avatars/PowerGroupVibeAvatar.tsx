import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import PowerGroupVibeIcon from '../group-vibe-icons/PowerGroupVibeIcon';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { washedTheme } from '../../../theme';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    colorDefault: {
      backgroundColor: washedTheme.palette.primary.main,
    },
  })
);

export default function PowerGroupVibeAvatar() {
  const classes = useStyles();
  return (
    <Avatar classes={{ colorDefault: classes.colorDefault }}>
      <PowerGroupVibeIcon color="primary" />
    </Avatar>
  );
}
