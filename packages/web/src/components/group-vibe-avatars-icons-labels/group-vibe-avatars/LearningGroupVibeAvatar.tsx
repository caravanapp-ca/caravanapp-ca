import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import LearningGroupVibeIcon from '../group-vibe-icons/LearningGroupVibeIcon';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { washedTheme } from '../../../theme';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    colorDefault: {
      backgroundColor: washedTheme.palette.primary.main,
    },
  })
);

export default function LearningGroupVibeAvatar() {
  const classes = useStyles();
  return (
    <Avatar classes={{ colorDefault: classes.colorDefault }}>
      <LearningGroupVibeIcon color="primary" />
    </Avatar>
  );
}
