import React from 'react';
import { Club, ReadingSpeed, GroupVibe } from '@caravan/buddy-reading-types';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, TextField, Radio } from '@material-ui/core';
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
import GroupSizeSelector from '../../../components/GroupSizeSelector';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sectionContainer: {
      marginTop: theme.spacing(3),
    },
    sectionLabel: {
      marginBottom: theme.spacing(1),
    },
    textField: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    editableTextFieldContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    formControl: {
      margin: theme.spacing(3),
    },
  })
);

interface GroupViewProps {
  club: Club;
  isEditing: boolean;
  onEdit: (
    field: 'bio' | 'maxMembers' | 'name' | 'readingSpeed' | 'vibe',
    newValue: string | number
  ) => void;
}

const readingSpeeds: ReadingSpeed[] = ['fast', 'moderate', 'slow'];
const groupVibes: GroupVibe[] = [
  'chill',
  'first-timers',
  'learning',
  'nerdy',
  'power',
];

const groupSizeMin = 2;
const groupSizeMax = 32;
let groupSizesStrArr: string[] = [];
for (let i = groupSizeMin; i <= groupSizeMax; i++) {
  groupSizesStrArr.push(i.toString());
}

const validName = (name: string): boolean => {
  if (name.length > 0 && name.trim().length < 2) {
    return false;
  }
  return true;
};
const validBio = (bio: string): boolean => {
  if (bio.trim().length < 3) {
    return false;
  }
  return true;
};

export default function GroupView(props: GroupViewProps) {
  const classes = useStyles();
  const { isEditing, onEdit } = props;
  const { bio, maxMembers, members, name, vibe, readingSpeed } = props.club;
  const [focused, setFocused] = React.useState<{ bio: boolean; name: boolean }>(
    {
      bio: false,
      name: false,
    }
  );

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
  if (isEditing) {
    return (
      <div>
        <div className={classes.sectionContainer}>
          <Typography variant={'h6'} className={classes.sectionLabel}>
            About the Group
          </Typography>
          <div className={classes.editableTextFieldContainer}>
            <TextField
              id="club-name"
              label="Club Name"
              inputProps={{ maxLength: 50 }}
              onFocus={() => setFocused({ ...focused, name: true })}
              onBlur={() => setFocused({ ...focused, name: false })}
              error={!validName(name)}
              helperText={
                !validName(name)
                  ? 'Must be 2 chars or longer'
                  : focused.name
                  ? name
                    ? `${50 - name.length} chars remaining`
                    : 'Max 50 chars'
                  : ' '
              }
              className={classes.textField}
              value={name}
              onChange={e => onEdit('name', e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="club-bio"
              label="Club Bio"
              inputProps={{ maxLength: 300 }}
              onFocus={() => setFocused({ ...focused, bio: true })}
              onBlur={() => setFocused({ ...focused, bio: false })}
              error={!bio || !validBio(bio)}
              helperText={
                !bio || !validBio(bio)
                  ? 'Is required, and must be 3 chars or longer'
                  : focused.bio
                  ? bio
                    ? `${300 - bio.trim().length} chars remaining`
                    : 'Max 300 chars'
                  : ' '
              }
              className={classes.textField}
              value={bio}
              onChange={e => onEdit('bio', e.target.value)}
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
            />
          </div>
        </div>
        <div className={classes.sectionContainer}>
          <Typography variant={'h6'} className={classes.sectionLabel}>
            Reading Speed
          </Typography>
          {readingSpeeds.map(speed => (
            <ListElementAvatar
              key={speed}
              primaryElement={
                <Radio
                  checked={readingSpeed === speed}
                  onChange={() => onEdit('readingSpeed', speed)}
                  value={speed}
                  name={`radio-button-${speed}`}
                  color="primary"
                />
              }
              avatarElement={readingSpeedIcons(speed, 'avatar')}
              primaryText={readingSpeedLabels(speed)}
              secondaryText={readingSpeedLabels(speed, 'description')}
            />
          ))}
        </div>
        <div className={classes.sectionContainer}>
          <Typography variant={'h6'} className={classes.sectionLabel}>
            Vibe
          </Typography>
          {groupVibes.map(v => (
            <ListElementAvatar
              key={v}
              primaryElement={
                <Radio
                  checked={vibe === v}
                  onChange={() => onEdit('vibe', v)}
                  value={v}
                  name={`radio-button-${v}`}
                  color="primary"
                />
              }
              avatarElement={groupVibeIcons(v, 'avatar')}
              primaryText={groupVibeLabels(v)}
            />
          ))}
        </div>
        <div className={classes.sectionContainer}>
          <Typography variant={'h6'} className={classes.sectionLabel}>
            Members
          </Typography>
          <GroupSizeSelector
            onChangeSize={e =>
              onEdit('maxMembers', parseInt(e.target.value as string))
            }
            selectedSize={maxMembers.toString()}
            sizes={groupSizesStrArr.map(str => ({
              label: str,
              enabled: members.length <= parseInt(str) ? true : false,
            }))}
            showContactMessage={true}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className={classes.sectionContainer}>
          <Typography variant={'h6'} className={classes.sectionLabel}>
            Bio
          </Typography>
          {bio && <Typography>{bio}</Typography>}
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
        <div className={classes.sectionContainer}>
          <Typography variant={'h6'} className={classes.sectionLabel}>
            Members
          </Typography>
          <MemberList
            members={members}
            maxMembers={maxMembers}
            ownerId={props.club.ownerId}
          />
        </div>
      </div>
    );
  }
}
