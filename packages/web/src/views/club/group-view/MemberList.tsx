import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { List, Avatar, IconButton } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import { MemberInfo } from '@caravan/buddy-reading-types';
import ListElementAvatar from '../../../components/ListElementAvatar';
import FreeGroupSlotListElement from '../../../components/FreeGroupSlotListElement';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

interface MemberListProps {
  members: MemberInfo[];
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
          key={m._id}
          avatarElement={
            m.discord.avatar ? (
              <Avatar alt={m.discord.username} src={m.discord.avatar} />
            ) : null
          }
          primaryText={m.discord.username}
          secondaryElement={
            m.role === 'owner' ? (
              <IconButton edge="end" aria-label="Delete">
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