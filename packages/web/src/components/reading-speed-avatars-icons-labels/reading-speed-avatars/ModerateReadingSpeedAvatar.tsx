import React from 'react';

import { Avatar, createStyles, makeStyles, Theme } from '@material-ui/core';

import { washedTheme } from '../../../theme';
import ModerateReadingSpeedIcon from '../reading-speed-icons/ModerateReadingSpeedIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    colorDefault: {
      backgroundColor: washedTheme.palette.primary.main,
    },
  })
);

export default function ModerateReadingSpeedAvatar() {
  const classes = useStyles();
  return (
    <Avatar classes={{ colorDefault: classes.colorDefault }}>
      <ModerateReadingSpeedIcon color="primary" />
    </Avatar>
  );
}
