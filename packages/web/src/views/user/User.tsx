import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { User } from '@caravan/buddy-reading-types';
import {
  makeStyles,
  createStyles,
  Theme,
  Paper,
  Tabs,
  useMediaQuery,
  useTheme,
  Tab,
  Button,
  Typography,
  Container,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import ThreeDotsIcon from '@material-ui/icons/MoreVert';
import MessageIcon from '@material-ui/icons/Message';
import { getUser } from '../../services/user';
import { isMe } from '../../common/localStorage';
import Header from '../../components/Header';
import HeaderTitle from '../../components/HeaderTitle';
import UserAvatar from './UserAvatar';
import UserBio from './UserBio';
import UserShelf from './UserShelf';

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
    nameplateContainer: {
      display: 'flex',
      padding: theme.spacing(4),
      flexDirection: 'row',
      alignItems: 'center',
    },
    tabRoot: {
      flexGrow: 1,
    },
    activeViewContainer: {},
    leftIcon: {
      marginRight: theme.spacing(1),
    },
  })
);

// TODO: Get rid of this
const dummyUser: User = {
  _id: '0123456789',
  bio: 'Check out my WattPad!',
  discordId: '1234567890',
  website: 'wattpad.com/users/frescocherry',
  name: 'FrescoCherry',
  photoUrl:
    '../../resources/43171540_10156548611140822_6109789487653453824_n.jpg',
  readingSpeed: 'moderate',
  age: 22,
  gender: 'male',
  location: 'Toronto',
  isBot: false,
  urlSlug: 'matt-cherry',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function UserView(props: UserViewProps) {
  const classes = useStyles();
  const theme = useTheme();

  const { id: userId } = props.match.params;
  const [user, setUser] = React.useState<User | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [userIsMe, setUserIsMe] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);

  const screenSmallerThanMd = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

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

  const centerComponent = <HeaderTitle title={user.name || 'User Profile'} />;

  const rightComponent = (
    <IconButton edge="start" color="inherit" aria-label="More">
      <ThreeDotsIcon />
    </IconButton>
  );

  return (
    <>
      <Header
        leftComponent={leftComponent}
        centerComponent={centerComponent}
        rightComponent={rightComponent}
      />
      <div className={classes.nameplateContainer}>
        <UserAvatar user={user} />
        <div style={{ marginLeft: theme.spacing(4) }}>
          <Button
            variant="outlined"
            color="primary"
            // TODO: Connect this button to send a DM to the user on Discord
            onClick={() => {}}
          >
            <MessageIcon className={classes.leftIcon} />
            <Typography variant="button">MESSAGE</Typography>
          </Button>
        </div>
      </div>
      <Paper className={classes.tabRoot}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant={screenSmallerThanMd ? 'fullWidth' : undefined}
          centered={!screenSmallerThanMd}
        >
          <Tab label="Bio" />
          <Tab label="Shelf" />
        </Tabs>
      </Paper>
      <Container maxWidth={'md'}>
        <>
          {tabValue === 0 && <UserBio user={user} />}
          {tabValue === 1 && <UserShelf user={user} />}
        </>
      </Container>
    </>
  );
}
