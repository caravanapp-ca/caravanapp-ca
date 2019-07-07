import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import GenericGroupMemberIcon from '../icons/GenericGroupMemberIcon';
import { makeStyles } from '@material-ui/styles';
import { Theme, createStyles } from '@material-ui/core';
import { washedTheme } from '../../../theme';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    colorDefault: {
      backgroundColor: washedTheme.palette.primary.main,
    },
  })
);

export default function GenericGroupMemberAvatar() {
  const classes = useStyles();
  return (
    <Avatar classes={{ colorDefault: classes.colorDefault }}>
      <GenericGroupMemberIcon color="primary" />
    </Avatar>
  );
}
