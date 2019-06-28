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
} from '@material-ui/core';
import MessageIcon from '@material-ui/icons/Message';

interface UserShelfProps {
  user: User;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
  })
);

export default function UserNameplate(props: UserShelfProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { user } = props;

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
