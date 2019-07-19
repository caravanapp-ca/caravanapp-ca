import React from 'react';
import { User } from '@caravan/buddy-reading-types';
import { Avatar, makeStyles, Theme, createStyles } from '@material-ui/core';

interface UserAvatarProps {
  user: User;
  size?: number;
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
  if (size) {
    avatarClass = makeStyles(() =>
      createStyles({
        root: {
          height: size,
          width: size,
        },
      })
    );
  }

  return (
    <Avatar
      src={user.photoUrl}
      classes={avatarClass ? avatarClass() : undefined}
      style={style}
    />
  );
}
