import React from 'react';
import { Club, User } from '@caravan/buddy-reading-types';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sectionContainer: {
      marginTop: theme.spacing(3),
    },
    sectionLabel: {
      marginBottom: theme.spacing(1),
    },
  })
);

interface GroupViewProps {
  club: Club;
  memberInfo: User[];
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
      <div className={classes.sectionContainer}>
        <Typography variant={'h6'} className={classes.sectionLabel}>
          About the Group
        </Typography>
        {bio && <Typography>{bio}</Typography>}
      </div>
      <div className={classes.sectionContainer}>
        <Typography variant={'h6'} className={classes.sectionLabel}>
          Members
        </Typography>
        <MemberList
          members={memberInfo}
          maxMembers={maxMembers}
          ownerId={props.club.ownerId}
        />
      </div>
      <div className={classes.sectionContainer}>
        <Typography variant={'h6'} className={classes.sectionLabel}>
          Reading Speed
        </Typography>
        <ListElementAvatar
          avatarElement={readingSpeedAvatar}
          primaryText={readingSpeedString}
        />
      </div>
      <div className={classes.sectionContainer}>
        <Typography variant={'h6'} className={classes.sectionLabel}>
          Vibe
        </Typography>
        <ListElementAvatar
          avatarElement={groupVibeAvatar}
          primaryText={groupVibeString}
        />
      </div>
    </div>
  );
}
