import React from 'react';
import { User } from '@caravan/buddy-reading-types';
import DiscordAuthButton from '../../components/DiscordAuthButton';
import DiscordAuthorizeButton from '../../components/DiscordAuthorizeButton';

export interface UserCardProps {
  user: User | null;
}

export function UserCard(props: UserCardProps) {
  if (!props.user) {
    return <DiscordAuthButton />;
  }
  return (
    <div>
      <DiscordAuthorizeButton />
    </div>
  );
}
