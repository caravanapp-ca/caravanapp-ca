import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import ModerateReadingSpeedIcon from '../reading-speed-icons/ModerateReadingSpeedIcon';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { washedTheme } from '../../../theme';

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
