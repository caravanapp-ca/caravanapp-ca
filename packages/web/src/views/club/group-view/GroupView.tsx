import React from 'react';
import { Club } from '@caravan/buddy-reading-types';
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
}

export default function GroupView(props: GroupViewProps) {
  const classes = useStyles();
  const { bio, members, maxMembers, vibe, readingSpeed } = props.club;

  let readingSpeedAvatar;
  switch (readingSpeed) {
    case 'slow':
      readingSpeedAvatar = <SlowReadingSpeedAvatar />;
      break;
    case 'moderate':
      readingSpeedAvatar = <ModerateReadingSpeedAvatar />;
      break;
    case 'fast':
      readingSpeedAvatar = <FastReadingSpeedAvatar />;
      break;
  }

  let groupVibeAvatar;
  switch (vibe) {
    case 'chill':
      groupVibeAvatar = <ChillGroupVibeAvatar />;
      break;
    case 'first-timers':
      groupVibeAvatar = <FirstTimersGroupVibeAvatar />;
      break;
    case 'learning':
      groupVibeAvatar = <LearningGroupVibeAvatar />;
      break;
    case 'nerdy':
      groupVibeAvatar = <NerdyGroupVibeAvatar />;
      break;
    case 'power':
      groupVibeAvatar = <PowerGroupVibeAvatar />;
      break;
  }

  return (
    <div>
      <Typography>About the Group</Typography>
      {bio && <Typography>{bio}</Typography>}
      <Typography>Members</Typography>
      <MemberList members={members} maxMembers={maxMembers} />
      <Typography>Reading Speed</Typography>
      <ListElementAvatar
        avatarElement={readingSpeedAvatar}
        primaryText={readingSpeed}
      />
      <Typography>Vibe</Typography>
      <ListElementAvatar avatarElement={groupVibeAvatar} primaryText={vibe} />
    </div>
  );
}
