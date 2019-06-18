import React from 'react';
import { Club, MemberInfo } from '@caravan/buddy-reading-types';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import FanIcon from '@material-ui/icons/Toys';
import ListElementAvatar from '../../../components/ListElementAvatar';
import {
  SlowReadingSpeedAvatar,
  ModerateReadingSpeedAvatar,
  FastReadingSpeedAvatar,
} from '../../../components/reading-speed-avatars';
import {
  ChillGroupVibeAvatar,
  FirstTimersGroupVibeAvatar,
  LearningGroupVibeAvatar,
  NerdyGroupVibeAvatar,
  PowerGroupVibeAvatar,
} from '../../../components/group-vibe-avatars';
import MemberList from './MemberList';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

interface GroupViewProps {
  club: Club;
  memberInfo: MemberInfo[];
}

export default function GroupView(props: GroupViewProps) {
  const classes = useStyles();
  const { bio, maxMembers, vibe, readingSpeed } = props.club;
  const { memberInfo } = props;

  let readingSpeedString;
  let readingSpeedAvatar;
  switch (readingSpeed) {
    case 'slow':
      readingSpeedString = 'Slow';
      readingSpeedAvatar = <SlowReadingSpeedAvatar />;
      break;
    case 'moderate':
      readingSpeedString = 'Moderate';
      readingSpeedAvatar = <ModerateReadingSpeedAvatar />;
      break;
    case 'fast':
      readingSpeedString = 'Fast';
      readingSpeedAvatar = <FastReadingSpeedAvatar />;
      break;
  }

  let groupVibeString;
  let groupVibeAvatar;
  switch (vibe) {
    case 'chill':
      groupVibeString = 'Chill';
      groupVibeAvatar = <ChillGroupVibeAvatar />;
      break;
    case 'first-timers':
      groupVibeString = 'First-Timers';
      groupVibeAvatar = <FirstTimersGroupVibeAvatar />;
      break;
    case 'learning':
      groupVibeString = 'Learning';
      groupVibeAvatar = <LearningGroupVibeAvatar />;
      break;
    case 'nerdy':
      groupVibeString = 'Nerdy';
      groupVibeAvatar = <NerdyGroupVibeAvatar />;
      break;
    case 'power':
      groupVibeString = 'Power';
      groupVibeAvatar = <PowerGroupVibeAvatar />;
      break;
  }

  return (
    <div>
      <Typography>About the Group</Typography>
      {bio && <Typography>{bio}</Typography>}
      <Typography>Members</Typography>
      <MemberList members={memberInfo} maxMembers={maxMembers} />
      <Typography>Reading Speed</Typography>
      <ListElementAvatar
        avatarElement={readingSpeedAvatar}
        primaryText={readingSpeedString}
      />
      <Typography>Vibe</Typography>
      <ListElementAvatar
        avatarElement={groupVibeAvatar}
        primaryText={groupVibeString}
      />
    </div>
  );
}
