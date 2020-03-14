import React from 'react';

import { Avatar, createStyles, makeStyles, Theme } from '@material-ui/core';

import { washedTheme } from '../../../theme';
import EndIcon from '../icons/EndIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    colorDefault: {
      backgroundColor: washedTheme.palette.primary.main,
    },
  })
);

export default function EndAvatar() {
  const classes = useStyles();
  return (
    <Avatar classes={{ colorDefault: classes.colorDefault }}>
      <EndIcon color="primary" />
    </Avatar>
  );
}
