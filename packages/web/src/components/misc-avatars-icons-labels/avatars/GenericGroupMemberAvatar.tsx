import React from 'react';

import { Avatar, createStyles, makeStyles, Theme } from '@material-ui/core';

import { washedTheme } from '../../../theme';
import GenericGroupMemberIcon from '../icons/GenericGroupMemberIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    colorDefault: {
      backgroundColor: washedTheme.palette.primary.main,
    },
  })
);

interface GenericGroupMemberAvatarProps {
  style?: Object;
  iconStyle?: Object;
}

export default function GenericGroupMemberAvatar(
  props: GenericGroupMemberAvatarProps
) {
  const classes = useStyles();
  const { style, iconStyle } = props;
  return (
    <Avatar classes={{ colorDefault: classes.colorDefault }} style={style}>
      <GenericGroupMemberIcon color="primary" style={iconStyle} />
    </Avatar>
  );
}
