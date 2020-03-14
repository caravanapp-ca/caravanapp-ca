import React from 'react';

import {
  Club,
  ClubBotSettings,
  GroupVibe,
  ReadingSpeed,
} from '@caravanapp/types';
import {
  createStyles,
  makeStyles,
  Radio,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';

import {
  CARAVAN_BOT_NAME,
  CLUB_BOT_SETTINGS_KEYS_DESCRIPTIONS,
  CLUB_SIZE_MAX,
  CLUB_SIZE_NO_LIMIT_LABEL,
  DEFAULT_MEMBER_LIMIT,
  UNLIMITED_CLUB_MEMBERS_VALUE,
} from '../../../common/globalConstants';
import BotMessageVector from '../../../components/BotMessageVector';
import CheckboxSettingsEditor from '../../../components/CheckboxSettingsEditor';
import ClubMemberLimitEditor from '../../../components/ClubMemberLimitEditor';
import ClubPrivacySlider from '../../../components/ClubPrivacySlider';
import {
  groupVibeIcons,
  groupVibeLabels,
} from '../../../components/group-vibe-avatars-icons-labels';
import ListElementAvatar from '../../../components/ListElementAvatar';
import {
  readingSpeedIcons,
  readingSpeedLabels,
} from '../../../components/reading-speed-avatars-icons-labels';
import MemberList from './MemberList';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sectionContainer: {
      marginTop: theme.spacing(4),
    },
    subSectionContainer: {
      marginTop: theme.spacing(2),
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
    centeredColumnContainer: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
    },
    twoLabelSwitchContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
  })
);

interface GroupViewProps {
  club: Club;
  isEditing: boolean;
  onEdit: (
    field:
      | 'bio'
      | 'botSettings'
      | 'maxMembers'
      | 'name'
      | 'readingSpeed'
      | 'unlisted'
      | 'vibe',
    newValue: boolean | number | string | ClubBotSettings
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

// TODO: Move these min/max declarations somewhere more global
const nameMin = 2;
const nameMax = 50;
const validName = (name: string): boolean => {
  if (name.length > 0 && name.trim().length < nameMin) {
    return false;
  }
  if (name.length > nameMax) {
    return false;
  }
  return true;
};
const bioMin = 3;
const bioMax = 300;
const validBio = (bio: string): boolean => {
  if (bio.trim().length < bioMin) {
    return false;
  }
  if (bio.length > bioMax) {
    return false;
  }
  return true;
};

export default function GroupView(props: GroupViewProps) {
  const classes = useStyles();
  const { isEditing, onEdit } = props;
  const {
    bio,
    botSettings,
    maxMembers,
    members,
    name,
    readingSpeed,
    unlisted,
    vibe,
  } = props.club;
  const [focused, setFocused] = React.useState<{ bio: boolean; name: boolean }>(
    {
      bio: false,
      name: false,
    }
  );
  const [limitGroupSize, setLimitGroupSize] = React.useState<boolean>(
    maxMembers > 0
  );
  const [selectedGroupSize, setSelectedGroupSize] = React.useState<number>(
    maxMembers === UNLIMITED_CLUB_MEMBERS_VALUE
      ? Math.max(DEFAULT_MEMBER_LIMIT, members.length)
      : maxMembers
  );

  const handleGroupLimitSwitch = () => {
    if (!limitGroupSize) {
      onEdit('maxMembers', selectedGroupSize);
    } else {
      onEdit('maxMembers', UNLIMITED_CLUB_MEMBERS_VALUE);
    }
    setLimitGroupSize(!limitGroupSize);
  };

  const handleGroupSizeChange = (
    e: React.ChangeEvent<{
      name?: string;
      value: unknown;
    }>
  ) => {
    const newVal = e.target.value as string;
    if (newVal === CLUB_SIZE_NO_LIMIT_LABEL) {
      onEdit('maxMembers', UNLIMITED_CLUB_MEMBERS_VALUE);
      setLimitGroupSize(false);
    } else {
      const newValNum = parseInt(newVal);
      onEdit('maxMembers', newValNum);
      setSelectedGroupSize(newValNum);
    }
  };

  const handleBotSettingsChange = (newVal: ClubBotSettings) => {
    onEdit('botSettings', newVal);
  };

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
            Visibility
          </Typography>
          <ClubPrivacySlider
            unlisted={unlisted}
            onChange={newUnlisted => onEdit('unlisted', newUnlisted)}
          />
        </div>
        <div className={classes.sectionContainer}>
          <Typography variant={'h6'} className={classes.sectionLabel}>
            Bio
          </Typography>
          <div className={classes.editableTextFieldContainer}>
            <TextField
              id="club-name"
              label="Club Name"
              inputProps={{ maxLength: nameMax }}
              onFocus={() => setFocused({ ...focused, name: true })}
              onBlur={() => setFocused({ ...focused, name: false })}
              error={!validName(name)}
              helperText={
                !validName(name)
                  ? `Must be ${nameMin} chars or longer`
                  : focused.name
                  ? name
                    ? `${nameMax - name.length} chars remaining`
                    : `Max ${nameMax} chars`
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
              inputProps={{ maxLength: bioMax }}
              onFocus={() => setFocused({ ...focused, bio: true })}
              onBlur={() => setFocused({ ...focused, bio: false })}
              error={!bio || !validBio(bio)}
              helperText={
                !bio || !validBio(bio)
                  ? `Is required, and must be ${bioMin} chars or longer`
                  : focused.bio
                  ? bio
                    ? `${bioMax - bio.trim().length} chars remaining`
                    : `Max ${bioMax} chars`
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
          {members.length > CLUB_SIZE_MAX && (
            <Typography color="textSecondary" style={{ fontStyle: 'italic' }}>
              This club is now too large to impose a member limit. Contact the
              Caravan team if you require a custom limit.
            </Typography>
          )}
          {members.length <= CLUB_SIZE_MAX && (
            <ClubMemberLimitEditor
              handleGroupLimitSwitch={handleGroupLimitSwitch}
              handleGroupSizeChange={handleGroupSizeChange}
              limitGroupSize={limitGroupSize}
              numMembers={members.length}
              selectedGroupSize={selectedGroupSize}
            />
          )}
        </div>
        <div className={classes.sectionContainer}>
          <Typography variant={'h6'} className={classes.sectionLabel}>
            Bot
          </Typography>
          <BotMessageVector
            message={`Hi! I'm ${CARAVAN_BOT_NAME}. I can help make running your club easier! Let me know what you'd like me to do below.`}
          />
          <div className={classes.subSectionContainer}>
            <CheckboxSettingsEditor<ClubBotSettings>
              label="What bot services would you like to enable?"
              onChange={handleBotSettingsChange}
              options={CLUB_BOT_SETTINGS_KEYS_DESCRIPTIONS}
              // TODO: Set this to true once we have more than one option.
              showSelectAllButtons={false}
              value={botSettings}
            />
          </div>
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
            {`Members: ${members.length}${
              maxMembers === UNLIMITED_CLUB_MEMBERS_VALUE
                ? ``
                : ` (Max ${maxMembers})`
            }`}
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
