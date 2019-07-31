import React from 'react';
import { User } from '@caravan/buddy-reading-types';
import { Avatar, makeStyles, Theme, createStyles } from '@material-ui/core';
import { shrinkDiscordPhotoSize } from '../../common/discord';

interface UserAvatarProps {
  user: User;
  size?: number;
  style?: Object;
}

export default function UserAvatar(props: UserAvatarProps) {
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

  const discordPhotoSize = size === 144 ? 256 : 128;

  return (
    <Avatar
      src={shrinkDiscordPhotoSize(user.photoUrl, discordPhotoSize)}
      classes={avatarClass ? avatarClass() : undefined}
      style={style}
    />
  );
}
