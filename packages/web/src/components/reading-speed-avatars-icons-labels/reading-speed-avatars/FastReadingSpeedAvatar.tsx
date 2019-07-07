import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import FastReadingSpeedIcon from '../reading-speed-icons/FastReadingSpeedIcon';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { washedTheme } from '../../../theme';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    colorDefault: {
      backgroundColor: washedTheme.palette.primary.main,
    },
  })
);

export default function FastReadingSpeedAvatar() {
  const classes = useStyles();
  return (
    <Avatar classes={{ colorDefault: classes.colorDefault }}>
      <FastReadingSpeedIcon color="primary" />
    </Avatar>
  );
}
