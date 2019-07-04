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
import MessageIcon from '@material-ui/icons/Message';

interface UserNameplateProps {
  user: User;
  userIsMe: boolean;
  isEditing: boolean;
  onEdit: (field: 'name' | 'bio' | 'website', newValue: string) => void;
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
  const { user, userIsMe, isEditing, onEdit } = props;

  // TODO: Add userIsMe to if statement after testing
  if (isEditing && onEdit) {
    return (
      <div className={classes.editContainer}>
        <TextField
          id="display-name"
          label="Display Name"
          className={classes.textField}
          value={user.name}
          onChange={e => onEdit('name', e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <TextField
          id="bio"
          label="Bio"
          className={classes.textField}
          value={user.bio}
          onChange={e => onEdit('bio', e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <TextField
          id="website"
          label="Website"
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
            <Typography variant="button">MESSAGE</Typography>
            <MessageIcon className={classes.rightIcon} />
          </Button>
        )}
      </>
    );
  }
}
