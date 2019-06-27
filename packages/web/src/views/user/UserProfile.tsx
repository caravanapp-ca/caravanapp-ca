import React, { useEffect } from 'react';
import { User } from '@caravan/buddy-reading-types';
import { isMe } from '../../common/localStorage';

export interface UserProfileProps {
  onEdit: () => void;
  user: User;
}

export function UserProfile(props: UserProfileProps) {
  const { user } = props;
  const [userIsMe, setUserIsMe] = React.useState(false);
  useEffect(() => {
    const isUserMe = isMe(user._id);
    setUserIsMe(isUserMe);
  }, []);
  return <></>;
}
