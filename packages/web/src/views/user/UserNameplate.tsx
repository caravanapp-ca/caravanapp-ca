import React from 'react';
import { User } from '@caravan/buddy-reading-types';
import {
  Typography,
  Button,
  Link,
  makeStyles,
  createStyles,
  useTheme,
  Theme,
  TextField,
} from '@material-ui/core';
import { ReactComponent as DiscordLogo } from '../../resources/discord-logo.svg';

interface UserNameplateProps {
  user: User;
  userIsMe: boolean;
  isEditing: boolean;
  onEdit: (field: 'name' | 'bio' | 'website', newValue: string) => void;
  valid: [boolean, string][];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    editContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    textField: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

export default function UserNameplate(props: UserNameplateProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { user, userIsMe, isEditing, onEdit, valid } = props;
  const [focused, setFocused] = React.useState<{
    name: boolean;
    bio: boolean;
    website: boolean;
  }>({
    name: false,
    bio: false,
    website: false,
  });

  const lengths = {
    name: {
      min: 2,
      max: 100,
    },
    bio: {
      min: 0,
      max: 150,
    },
  };

  const msgBtnLabel: string = user.discordUsername
    ? `MESSAGE ${user.discordUsername}`
    : 'MESSAGE';
  const msgBtnLabelCaps = msgBtnLabel.toUpperCase();

  // TODO: Add userIsMe to if statement after testing
  if (isEditing && onEdit) {
    return (
      <div className={classes.editContainer}>
        <TextField
          id="display-name"
          label="Display Name"
          inputProps={{ maxLength: lengths.name.max }}
          onFocus={() => setFocused({ ...focused, name: true })}
          onBlur={() => setFocused({ ...focused, name: false })}
          error={!valid[0][0]}
          helperText={
            !valid[0][0]
              ? valid[0][1]
              : focused.name
              ? user && user.name
                ? `${lengths.name.max - user.name.length} chars remaining`
                : `Max ${lengths.name.max} chars`
              : ' '
          }
          className={classes.textField}
          value={user.name}
          onChange={e => onEdit('name', e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <TextField
          id="bio"
          label="Bio"
          multiline
          rowsMax={2}
          inputProps={{ maxLength: lengths.bio.max }}
          onFocus={() => setFocused({ ...focused, bio: true })}
          onBlur={() => setFocused({ ...focused, bio: false })}
          error={!valid[1][0]}
          helperText={
            !valid[1][0]
              ? valid[1][1]
              : focused.bio
              ? user && user.bio
                ? `${lengths.bio.max - user.bio.length} chars remaining`
                : `Max ${lengths.bio.max} chars`
              : ' '
          }
          className={classes.textField}
          value={user.bio}
          onChange={e => onEdit('bio', e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <TextField
          id="website"
          label="Website"
          onFocus={() => setFocused({ ...focused, website: true })}
          onBlur={() => setFocused({ ...focused, website: false })}
          error={!valid[2][0]}
          helperText={!valid[2][0] ? valid[2][1] : ' '}
          className={classes.textField}
          value={user.website}
          onChange={e => onEdit('website', e.target.value)}
          margin="normal"
          variant="outlined"
        />
      </div>
    );
  } else {
    return (
      <>
        <Typography variant="h4">{user.name}</Typography>
        <Typography variant="body1" style={{ marginTop: theme.spacing(1) }}>
          {user.bio}
        </Typography>
        <Typography variant="body1">
          <Link onClick={() => window.open(user.website)}>{user.website}</Link>
        </Typography>
        {!userIsMe && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() =>
              window.open(
                `https://discordapp.com/channels/592761082523680798/592810415193587724`,
                '_blank'
              )
            }
            style={{ marginTop: theme.spacing(1) }}
          >
            <Typography variant="button">{msgBtnLabelCaps}</Typography>
            <DiscordLogo
              style={{
                marginLeft: theme.spacing(1),
                height: 28,
                width: 28,
              }}
            />
          </Button>
        )}
      </>
    );
  }
}
