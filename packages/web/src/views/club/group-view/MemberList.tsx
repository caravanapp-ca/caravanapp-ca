import React from 'react';

import { User } from '@caravanapp/types';
import { Avatar, Grid, IconButton } from '@material-ui/core';
import { Star as StarIcon } from '@material-ui/icons';

import { shrinkDiscordPhotoSize } from '../../../common/discord';
import { getBadgeToDisplay } from '../../../common/getBadgeToDisplay';
import FreeGroupSlotListElement from '../../../components/FreeGroupSlotListElement';
import ListElementAvatar from '../../../components/ListElementAvatar';

interface MemberListProps {
  ownerId: string;
  members: User[];
  maxMembers: number;
}

export default function MemberList(props: MemberListProps) {
  const { maxMembers, members } = props;
  const freeSlots = Math.max(maxMembers - members.length, 0);

  let emptySlots = [];
  for (let i = 0; i < freeSlots; i++) {
    emptySlots.push(
      <Grid item xs={12} sm={6} key={i}>
        <FreeGroupSlotListElement />
      </Grid>
    );
  }

  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
    >
      {members.map(m => {
        const badge = getBadgeToDisplay(m.badges);
        return (
          <Grid item xs={12} sm={6} key={m._id}>
            <ListElementAvatar
              button={m.urlSlug ? true : undefined}
              link={m.urlSlug ? `/user/${m.urlSlug}` : undefined}
              key={m._id}
              avatarElement={
                m.photoUrl ? (
                  <Avatar
                    alt={m.name || m.discordUsername}
                    src={shrinkDiscordPhotoSize(m.photoUrl, 64)}
                  />
                ) : undefined
              }
              primaryText={m.name || m.discordUsername}
              badge={badge}
              secondaryElement={
                props.ownerId === m._id ? (
                  <IconButton edge="end" aria-label="Star" disabled={true}>
                    <StarIcon />
                  </IconButton>
                ) : undefined
              }
            />
          </Grid>
        );
      })}
      {emptySlots.length > 0 && emptySlots}
    </Grid>
  );
}
