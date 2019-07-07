import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import SlowReadingSpeedIcon from '../reading-speed-icons/SlowReadingSpeedIcon';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { washedTheme } from '../../../theme';

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
