import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import ChillGroupVibeIcon from '../group-vibe-icons/ChillGroupVibeIcon';
import { washedTheme } from '../../../theme';
import { makeStyles, Theme, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    colorDefault: {
      backgroundColor: washedTheme.palette.primary.main,
    },
  })
);

export default function ChillGroupVibeAvatar() {
  const classes = useStyles();
  return (
    <Avatar classes={{ colorDefault: classes.colorDefault }}>
      <ChillGroupVibeIcon color="primary" />
    </Avatar>
  );
}
