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
  isEditing?: boolean;
  onEdit?: (key: 'name' | 'bio' | 'website', newValue: string) => void;
  displayName?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
    leftIcon: {
      marginRight: theme.spacing(1),
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
  const { user, isEditing, onEdit } = props;

  if (isEditing && onEdit) {
    return (
      <>
        <TextField
          id="display-name"
          label="Display Name"
          className={classes.textField}
          value={user.name}
          onChange={e => onEdit('name', e.target.value)}
          margin="normal"
          variant="outlined"
        />
      </>
    );
  } else {
    return (
      <>
        <Typography variant="h4">{user.name}</Typography>
        <Typography variant="body1" style={{ marginTop: theme.spacing(1) }}>
          {user.bio}
        </Typography>
        <Typography variant="body1">
          <Link href={user.website}>{user.website}</Link>
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          // TODO: Connect this button to send a DM to the user on Discord
          onClick={() => {}}
          style={{ marginTop: theme.spacing(1) }}
        >
          <Typography variant="button">MESSAGE</Typography>
          <MessageIcon className={classes.rightIcon} />
        </Button>
      </>
    );
  }
}
