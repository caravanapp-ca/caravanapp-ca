import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { User } from '@caravan/buddy-reading-types';
import { makeStyles, createStyles, Theme } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import ThreeDotsIcon from '@material-ui/icons/MoreVert';
import { getUser } from '../../services/user';
import { isMe } from '../../common/localStorage';
import Header from '../../components/Header';

interface UserRouteParams {
  id: string;
}

interface UserViewProps extends RouteComponentProps<UserRouteParams> {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      justifyItems: 'center',
    },
  })
);

export default function UserView(props: UserViewProps) {
  const classes = useStyles();
  const { id: userId } = props.match.params;
  const [user, setUser] = React.useState<User | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [userIsMe, setUserIsMe] = React.useState(false);

  useEffect(() => {
    getUser(userId).then(user => {
      if (user) {
        const isUserMe = isMe(user._id);
        setUserIsMe(isUserMe);
      }
      setUser(user);
    });
  }, [userId]);

  if (!user) {
    return (
      <div className={classes.loadingContainer}>
        Loading user...
        <CircularProgress />
      </div>
    );
  }

  const leftComponent = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="Back"
      onClick={() => props.history.goBack()}
    >
      <BackIcon />
    </IconButton>
  );

  const rightComponent = (
    <IconButton edge="start" color="inherit" aria-label="More">
      <ThreeDotsIcon />
    </IconButton>
  );

  return (
    <>
      <Header leftComponent={<div />} rightComponent={rightComponent} />
      <main />
    </>
  );
}
