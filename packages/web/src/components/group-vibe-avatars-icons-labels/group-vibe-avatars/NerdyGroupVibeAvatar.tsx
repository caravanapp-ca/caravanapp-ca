import React from 'react';

import { Avatar, createStyles, makeStyles, Theme } from '@material-ui/core';

import { washedTheme } from '../../../theme';
import NerdyGroupVibeIcon from '../group-vibe-icons/NerdyGroupVibeIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    colorDefault: {
      backgroundColor: washedTheme.palette.primary.main,
    },
  })
);

export default function NerdyGroupVibeAvatar() {
  const classes = useStyles();
  return (
    <Avatar classes={{ colorDefault: classes.colorDefault }}>
      <NerdyGroupVibeIcon color="primary" />
    </Avatar>
  );
}
