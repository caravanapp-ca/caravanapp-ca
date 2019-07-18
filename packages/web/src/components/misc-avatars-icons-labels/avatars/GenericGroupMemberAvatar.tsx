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

interface GenericGroupMemberAvatarProps {
  style?: Object;
}

export default function GenericGroupMemberAvatar(
  props: GenericGroupMemberAvatarProps
) {
  const classes = useStyles();
  const { style } = props;
  return (
    <Avatar classes={{ colorDefault: classes.colorDefault }} style={style}>
      <GenericGroupMemberIcon color="primary" fontSize="large" />
    </Avatar>
  );
}
