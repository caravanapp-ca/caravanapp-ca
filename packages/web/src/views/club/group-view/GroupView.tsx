import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import FanIcon from '@material-ui/icons/Toys';
import { ClubDoc } from '@caravan/buddy-reading-types';
import ListElementAvatar from '../../../components/ListElementAvatar';
import SlowReadingSpeedAvatar from '../../../components/reading-speed-avatars/SlowReadingSpeedAvatar';
import ModerateReadingSpeedAvatar from '../../../components/reading-speed-avatars/ModerateReadingSpeedAvatar';
import FastReadingSpeedAvatar from '../../../components/reading-speed-avatars/FastReadingSpeedAvatar';
import MemberList from './MemberList'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  }),
);

interface GroupViewProps {
  club: ClubDoc;
}

export default function GroupView(props: GroupViewProps) {

  const { bio, maxMembers, vibe, readingSpeed } = props.club;

  let avatarElement = <SlowReadingSpeedAvatar/>
  switch(readingSpeed){
    case 'moderate':
      avatarElement = <ModerateReadingSpeedAvatar/>
      break;
    case 'fast':
      avatarElement = <FastReadingSpeedAvatar/>
      break;
  }

  const classes = useStyles();

  return (
    <div>
      <Typography>About the Group</Typography>
      <Typography>
        {bio}
      </Typography>
      <Typography>Members</Typography>
      <MemberList/>
      <Typography>Reading Speed</Typography>
      <ListElementAvatar
        avatarElement={avatarElement}
        primaryText={readingSpeed}
      />
      <Typography>Vibe</Typography>
      <ListElementAvatar
        avatarElement={<Avatar><FanIcon /></Avatar>}
        primaryText='Chill'
      />
    </div>
  )
}
