import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { List, Avatar, IconButton, Grid } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import ListElementAvatar from '../../../components/ListElementAvatar';
import FreeGroupSlotListElement from '../../../components/FreeGroupSlotListElement';

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
    emptySlots.push(
      <Grid item xs={12} sm={6}>
        <FreeGroupSlotListElement key={i} />
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
      {members.map(m => (
        <Grid item xs={12} sm={6}>
          <ListElementAvatar
            button={m.urlSlug ? true : undefined}
            link={m.urlSlug ? `/user/${m.urlSlug}` : undefined}
            key={m._id}
            avatarElement={
              m.photoUrl ? (
                <Avatar alt={m.name || m.discordUsername} src={m.photoUrl} />
              ) : (
                undefined
              )
            }
            primaryText={m.name || m.discordUsername}
            secondaryElement={
              props.ownerId === m._id ? (
                <IconButton edge="end" aria-label="Star" disabled={true}>
                  <StarIcon />
                </IconButton>
              ) : (
                undefined
              )
            }
          />
        </Grid>
      ))}
      {emptySlots.length > 0 && emptySlots}
    </Grid>
    // <List dense={false}>
    //   {members.map(m => (
    //     <ListElementAvatar
    //       button={m.urlSlug ? true : undefined}
    //       link={m.urlSlug ? `/user/${m.urlSlug}` : undefined}
    //       key={m._id}
    //       avatarElement={
    //         m.photoUrl ? (
    //           <Avatar alt={m.name || m.discordUsername} src={m.photoUrl} />
    //         ) : (
    //           undefined
    //         )
    //       }
    //       primaryText={m.name || m.discordUsername}
    //       secondaryElement={
    //         props.ownerId === m._id ? (
    //           <IconButton edge="end" aria-label="Star" disabled={true}>
    //             <StarIcon />
    //           </IconButton>
    //         ) : (
    //           undefined
    //         )
    //       }
    //     />
    //   ))}
    //   {emptySlots.length > 0 && emptySlots}
    // </List>
  );
}
