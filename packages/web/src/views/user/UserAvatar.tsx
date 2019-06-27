import React from 'react';
import { User } from '@caravan/buddy-reading-types';
import { Avatar, makeStyles, Theme, createStyles } from '@material-ui/core';

interface UserAvatarProps {
  user: User;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    userProfileImage: {
      width: 144,
      height: 144,
    },
  })
);

export default function UserAvatar(props: UserAvatarProps) {
  const classes = useStyles();
  const { user } = props;
  return <Avatar src={user.photoUrl} className={classes.userProfileImage} />;
}
