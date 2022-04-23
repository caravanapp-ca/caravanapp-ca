import React from 'react';

import { User } from '@caravanapp/types';
import { Avatar, createStyles, makeStyles } from '@material-ui/core';

import { shrinkDiscordPhotoSize } from '../../common/discord';

interface UserAvatarProps {
  user: User;
  size?: number;
  style?: Object;
}

export default function UserAvatar(props: UserAvatarProps) {
  const { user, size, style } = props;

  const avatarClass = size
    ? makeStyles(() =>
        createStyles({
          root: {
            height: size,
            width: size,
          },
        })
      )()
    : undefined;

  const photoUrl = user.photoUrl
    ? shrinkDiscordPhotoSize(user.photoUrl, size)
    : undefined;

  return <Avatar src={photoUrl} classes={avatarClass} style={style} />;
}
