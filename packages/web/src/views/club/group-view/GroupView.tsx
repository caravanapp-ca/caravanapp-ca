import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import MemberList from './MemberList'
import ListElementAvatar from '../../../components/ListElementAvatar';
import Avatar from '@material-ui/core/Avatar';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import FanIcon from '@material-ui/icons/Toys';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  }),
);

export default function GroupView() {

  const classes = useStyles();

  return (
    <div>
      <Typography>About the Group</Typography>
      <Typography>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut convallis ligula. Fusce eget sollicitudin massa. Vestibulum sodales purus a turpis convallis, eget lacinia tellus ultrices. Nullam nulla augue, feugiat volutpat pulvinar dapibus, tristique id.
      </Typography>
      <Typography>Members</Typography>
      <MemberList/>
      <Typography>Reading Speed</Typography>
      <ListElementAvatar
        avatarElement={<Avatar><DirectionsWalkIcon /></Avatar>}
        primaryText='Moderate'
      />
      <Typography>Vibe</Typography>
      <ListElementAvatar
        avatarElement={<Avatar><FanIcon /></Avatar>}
        primaryText='Chill'
      />
    </div>
  )
}
