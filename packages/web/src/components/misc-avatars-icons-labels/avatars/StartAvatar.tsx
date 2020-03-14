import React from 'react';

import { Avatar, createStyles, makeStyles, Theme } from '@material-ui/core';

import { washedTheme } from '../../../theme';
import StartIcon from '../icons/StartIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    colorDefault: {
      backgroundColor: washedTheme.palette.primary.main,
    },
  })
);

export default function StartAvatar() {
  const classes = useStyles();
  return (
    <Avatar classes={{ colorDefault: classes.colorDefault }}>
      <StartIcon color="primary" />
    </Avatar>
  );
}
