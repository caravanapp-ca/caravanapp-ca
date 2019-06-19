import React from 'react';
import { Club, MemberInfo } from '@caravan/buddy-reading-types';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import FanIcon from '@material-ui/icons/Toys';
import ListElementAvatar from '../../../components/ListElementAvatar';
import {
  readingSpeedIcons,
  readingSpeedLabels,
} from '../../../components/reading-speed-avatars-icons-labels';
import {
  groupVibeIcons,
  groupVibeLabels,
} from '../../../components/group-vibe-avatars-icons-labels';
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
  if (readingSpeed) {
    readingSpeedString = readingSpeedLabels(readingSpeed);
    readingSpeedAvatar = readingSpeedIcons(readingSpeed, 'avatar');
  }

  let groupVibeString;
  let groupVibeAvatar;
  if (vibe) {
    groupVibeString = groupVibeLabels(vibe);
    groupVibeAvatar = groupVibeIcons(vibe, 'avatar');
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
