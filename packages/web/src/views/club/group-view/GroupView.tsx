import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import FanIcon from '@material-ui/icons/Toys';
import { ClubDoc } from '@caravan/buddy-reading-types';
import ListElementAvatar from '../../../components/ListElementAvatar';
import { SlowReadingSpeedAvatar, ModerateReadingSpeedAvatar, FastReadingSpeedAvatar } from '../../../components/reading-speed-avatars';
import { ChillGroupVibeAvatar, FirstTimersGroupVibeAvatar, LearningGroupVibeAvatar, NerdyGroupVibeAvatar, PowerGroupVibeAvatar } from '../../../components/group-vibe-avatars';
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

  let readingSpeedAvatar = <SlowReadingSpeedAvatar/>
  switch(readingSpeed){
    case 'moderate':
      readingSpeedAvatar = <ModerateReadingSpeedAvatar/>
      break;
    case 'fast':
      readingSpeedAvatar = <FastReadingSpeedAvatar/>
      break;
  }

  let groupVibeAvatar = <ChillGroupVibeAvatar/>
  switch(vibe){
    case 'first-timers':
      groupVibeAvatar = <FirstTimersGroupVibeAvatar/>
      break;
    case 'learning':
      groupVibeAvatar = <LearningGroupVibeAvatar/>
      break;
    case 'nerdy':
      groupVibeAvatar = <NerdyGroupVibeAvatar/>
      break;
    case 'power':
      groupVibeAvatar = <PowerGroupVibeAvatar/>
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
        avatarElement={readingSpeedAvatar}
        primaryText={readingSpeed}
      />
      <Typography>Vibe</Typography>
      <ListElementAvatar
        avatarElement={groupVibeAvatar}
        primaryText={vibe}
      />
    </div>
  )
}
