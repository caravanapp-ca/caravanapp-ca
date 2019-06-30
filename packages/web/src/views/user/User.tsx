import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  User,
  ReadingState,
  UserShelfEntry,
} from '@caravan/buddy-reading-types';
import {
  makeStyles,
  createStyles,
  Theme,
  Paper,
  Tabs,
  useMediaQuery,
  useTheme,
  Tab,
  Container,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import ThreeDotsIcon from '@material-ui/icons/MoreVert';
import { getUser } from '../../services/user';
import { isMe } from '../../common/localStorage';
import Header from '../../components/Header';
import HeaderTitle from '../../components/HeaderTitle';
import UserAvatar from './UserAvatar';
import UserBio from './UserBio';
import UserShelf from './UserShelf';
import UserNameplate from './UserNameplate';
import { getClubsById } from '../../services/club';

interface UserRouteParams {
  id: string;
}

interface UserViewProps extends RouteComponentProps<UserRouteParams> {}

type UserShelfType = { [K in ReadingState]: UserShelfEntry[] };

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      justifyItems: 'center',
    },
    nameplateContainer: {
      backgroundColor: '#FFFFFF',
      display: 'flex',
      padding: theme.spacing(2),
      flexDirection: 'row',
      alignItems: 'center',
      position: 'relative',
      zIndex: 2,
    },
    tabRoot: {
      backgroundColor: '#FFFFFF',
      boxShadow: '0px 2px 4px #a0a0a0',
      flexGrow: 1,
      position: 'relative',
      zIndex: 1,
    },
    activeViewContainer: {},
    centerComponent: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
  })
);

export default function UserView(props: UserViewProps) {
  const classes = useStyles();
  const theme = useTheme();

  const { id: userId } = props.match.params;
  const [user, setUser] = React.useState<User | null>(null);
  const [userShelf, setUserShelf] = React.useState<UserShelfType>({
    current: [],
    notStarted: [],
    read: [],
  });
  const [isEditing, setIsEditing] = React.useState(false);
  const [userIsMe, setUserIsMe] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [scrolled, setScrolled] = React.useState(0);

  const screenSmallerThanMd = useMediaQuery(theme.breakpoints.down('sm'));
  const screenSmallerThanSm = useMediaQuery(theme.breakpoints.down('xs'));

  useEffect(() => {
    getUser(userId).then(user => {
      if (user) {
        const isUserMe = isMe(user._id);
        setUserIsMe(isUserMe);
        getUserShelf(user);
      }
      setUser(user);
    });
  }, [userId]);

  useEffect(() => window.addEventListener('scroll', listenToScroll), []);

  useEffect(() => {
    return () => {
      window.removeEventListener('scroll', listenToScroll);
    };
  }, []);

  const listenToScroll = () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    setScrolled(winScroll);
  };

  async function getUserShelf(user: User) {
    const userShelf: UserShelfType = {
      current: [],
      notStarted: [],
      read: [],
    };
    userShelf.notStarted = user.shelf.notStarted;
    userShelf.read = user.shelf.read;
    const clubIdsArr: string[] = [];
    const indices: number[] = [];
    userShelf.read.forEach((s, index) => {
      if (s.clubId) {
        indices.push(index);
        clubIdsArr.push(s.clubId);
      }
    });
    const clubs = await getClubsById(clubIdsArr);
    if (clubs && clubs.length === indices.length) {
      for (let i = 0; i < clubs.length; i++) {
        userShelf.read[indices[i]].club = clubs[i];
      }
    }
    // TODO: Call service to get the currently read books from the user's clubs.
    setUserShelf(userShelf);
  }

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

  const centerComponent = (
    <div className={classes.centerComponent}>
      <UserAvatar user={user} style={{ marginRight: theme.spacing(1) }} />
      <HeaderTitle title={user.name || 'User Profile'} />
    </div>
  );

  const rightComponent = (
    <IconButton edge="start" color="inherit" aria-label="More">
      <ThreeDotsIcon />
    </IconButton>
  );

  return (
    <>
      <Header
        leftComponent={leftComponent}
        centerComponent={scrolled > 64 ? centerComponent : undefined}
        rightComponent={rightComponent}
        showBorder={scrolled > 1 ? true : false}
      />
      <div className={classes.nameplateContainer}>
        <UserAvatar
          user={user}
          size={screenSmallerThanSm ? 'small' : 'large'}
        />
        <div style={{ marginLeft: theme.spacing(2) }}>
          <UserNameplate user={user} />
        </div>
      </div>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant={screenSmallerThanMd ? 'fullWidth' : undefined}
        centered={!screenSmallerThanMd}
        className={classes.tabRoot}
      >
        <Tab label="Bio" />
        <Tab label="Shelf" />
      </Tabs>
      <Container maxWidth={'md'}>
        <>
          {tabValue === 0 && <UserBio user={user} />}
          {tabValue === 1 && <UserShelf user={user} shelf={userShelf} />}
        </>
      </Container>
    </>
  );
}
