import React from 'react';
import { User } from '@caravan/buddy-reading-types';
import { Avatar, makeStyles, Theme, createStyles } from '@material-ui/core';

interface UserAvatarProps {
  user: User;
  size?: 'large' | 'small' | 'default';
  style?: Object;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    userProfileImageLarge: {
      width: 144,
      height: 144,
    },
    userProfileImageSmall: {
      width: 112,
      height: 112,
    },
  })
);

export default function UserAvatar(props: UserAvatarProps) {
  const classes = useStyles();
  const { user, size, style } = props;
  let avatarClass;
  switch (size) {
    case 'large':
      avatarClass = classes.userProfileImageLarge;
      break;
    case 'small':
      avatarClass = classes.userProfileImageSmall;
      break;
    case 'default':
      break;
    default:
      break;
  }

  return (
    <Avatar src={user.photoUrl} classes={{ root: avatarClass }} style={style} />
  );
}
