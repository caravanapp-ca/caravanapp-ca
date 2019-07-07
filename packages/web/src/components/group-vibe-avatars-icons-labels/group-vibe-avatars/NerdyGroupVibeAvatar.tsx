import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import NerdyGroupVibeIcon from '../group-vibe-icons/NerdyGroupVibeIcon';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { washedTheme } from '../../../theme';

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
