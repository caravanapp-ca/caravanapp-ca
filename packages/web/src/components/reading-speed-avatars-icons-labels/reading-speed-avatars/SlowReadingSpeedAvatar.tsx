import React from 'react';

import { Avatar, createStyles, makeStyles, Theme } from '@material-ui/core';

import { washedTheme } from '../../../theme';
import SlowReadingSpeedIcon from '../reading-speed-icons/SlowReadingSpeedIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    colorDefault: {
      backgroundColor: washedTheme.palette.primary.main,
    },
  })
);

export default function SlowReadingSpeedAvatar() {
  const classes = useStyles();
  return (
    <Avatar classes={{ colorDefault: classes.colorDefault }}>
      <SlowReadingSpeedIcon color="primary" />
    </Avatar>
  );
}
