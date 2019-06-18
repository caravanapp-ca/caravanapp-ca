import React from 'react';
import { UserDoc } from '@caravan/buddy-reading-types';
import DiscordAuthButton from '../../components/DiscordAuthButton';
import DiscordAuthorizeButton from '../../components/DiscordAuthorizeButton';

export interface UserCardProps {
  user: UserDoc | null;
}

export function UserCard(props: UserCardProps) {
  if (!props.user) {
    return <DiscordAuthButton />;
  }
  return (
    <div>
      <p>{props.user.name}</p>
      <p>{props.user.discord.username}</p>
      <p>{props.user.createdAt}</p>
      <DiscordAuthorizeButton />
    </div>
  );
}
