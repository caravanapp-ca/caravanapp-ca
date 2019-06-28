import React from 'react';
import { User } from '@caravan/buddy-reading-types';
import { Avatar, makeStyles, Theme, createStyles } from '@material-ui/core';

interface UserAvatarProps {
  user: User;
  size?: 'regular' | 'small';
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    userProfileImage: {
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
  const { user, size } = props;
  return (
    <Avatar
      src={user.photoUrl}
      className={
        size === 'small'
          ? classes.userProfileImageSmall
          : classes.userProfileImage
      }
    />
  );
}
