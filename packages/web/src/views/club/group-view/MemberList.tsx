import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { List, Avatar, IconButton } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import ListElementAvatar from '../../../components/ListElementAvatar';
import FreeGroupSlotListElement from '../../../components/FreeGroupSlotListElement';
import AdapterLink from '../../../components/AdapterLink';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

interface MemberListProps {
  ownerId: string;
  members: any[];
  maxMembers: number;
}

export default function MemberList(props: MemberListProps) {
  const classes = useStyles();
  const { maxMembers, members } = props;
  const freeSlots = Math.max(maxMembers - members.length, 0);

  let emptySlots = [];
  for (let i = 0; i < freeSlots; i++) {
    emptySlots.push(<FreeGroupSlotListElement key={i} />);
  }

  return (
    <List dense={false}>
      {members.map(m => (
        <ListElementAvatar
          button
          link={m.urlSlug ? `user/${m.urlSlug}` : `user/${m.userId}`}
          key={m.userId}
          avatarElement={
            m.photoUrl ? (
              <Avatar alt={m.name || m.discordUsername} src={m.photoUrl} />
            ) : null
          }
          primaryText={m.name || m.discordUsername}
          secondaryElement={
            props.ownerId === m.userId ? (
              <IconButton edge="end" aria-label="Star" disabled={true}>
                <StarIcon />
              </IconButton>
            ) : null
          }
        />
      ))}
      {emptySlots.length > 0 && emptySlots}
    </List>
  );
}
