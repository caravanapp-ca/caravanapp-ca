import React from 'react';

import { Avatar, createStyles, makeStyles, Theme } from '@material-ui/core';

import { washedTheme } from '../../../theme';
import FastReadingSpeedIcon from '../reading-speed-icons/FastReadingSpeedIcon';

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
