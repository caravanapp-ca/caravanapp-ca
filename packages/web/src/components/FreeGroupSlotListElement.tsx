import React from 'react';

import ListElementAvatar from './ListElementAvatar';
import GenericGroupMemberAvatar from './misc-avatars-icons-labels/avatars/GenericGroupMemberAvatar';

export default function FreeGroupSlotListElement() {
  return (
    <ListElementAvatar
      avatarElement={<GenericGroupMemberAvatar />}
      primaryText="Open!"
    />
  );
}
