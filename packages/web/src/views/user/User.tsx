import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  User,
  ReadingState,
  UserShelfEntry,
  EditableUserField,
  Services,
  ProfileQuestion,
  UserQA,
  ClubTransformed,
} from '@caravan/buddy-reading-types';
import {
  makeStyles,
  createStyles,
  Theme,
  Tabs,
  useMediaQuery,
  useTheme,
  Tab,
  Container,
} from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import EditIcon from '@material-ui/icons/Create';
import SaveIcon from '@material-ui/icons/Save';
import { getUser, modifyUser } from '../../services/user';
import Header from '../../components/Header';
import HeaderTitle from '../../components/HeaderTitle';
import CustomSnackbar, {
  CustomSnackbarProps,
} from '../../components/CustomSnackbar';
import UserAvatar from './UserAvatar';
import UserBio from './UserBio';
import UserShelf from './UserShelf';
import UserNameplate from './UserNameplate';
import UserClubs from './UserClubs';
import { getClubsByIdNoMembers, getAllClubs } from '../../services/club';
import { getAllGenres } from '../../services/genre';
import { getAllProfileQuestions } from '../../services/profile';
import { transformClubs } from '../home/Home';
import validURL from '../../functions/validURL';
import { makeUserTheme, makeUserDarkTheme } from '../../theme';

interface MinMax {
  min: number;
  max: number;
}

export interface UserQAwMinMax extends UserQA, MinMax {}

interface UserRouteParams {
  id: string;
}

interface UserViewProps extends RouteComponentProps<UserRouteParams> {
  user: User | null;
}

type UserShelfType = { [K in ReadingState]: UserShelfEntry[] };

const EditableUserFieldStringsArr: EditableUserField[] = [
  'bio',
  'goodreadsUrl',
  'website',
  'name',
  'photoUrl',
  'readingSpeed',
  'gender',
  'location',
  'palette',
];

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

const validationParams = {
  name: {
    length: {
      min: 2,
      max: 30,
    },
  },
  bio: {
    length: {
      min: 0,
      max: 150,
    },
  },
};

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
  const [shelfModified, setShelfModified] = React.useState<boolean>(false);
  const [userClubsTransformed, setUserClubsTransformed] = React.useState<
    ClubTransformed[]
  >([]);
  const [isEditing, setIsEditing] = React.useState(false);
  const [userIsMe, setUserIsMe] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [scrolled, setScrolled] = React.useState(0);
  const [genres, setGenres] = React.useState<Services.GetGenres | null>(null);
  const [userQuestionsWkspc, setUserQuestionsWkspc] = React.useState<UserQA[]>(
    []
  );
  const [questionsModified, setQuestionsModified] = React.useState<boolean>(
    false
  );
  const [
    questions,
    setQuestions,
  ] = React.useState<Services.GetProfileQuestions | null>(null);
  const [initQuestions, setInitQuestions] = React.useState<{
    initAnsweredQs: UserQAwMinMax[];
    initUnansweredQs: ProfileQuestion[];
  }>({
    initAnsweredQs: [],
    initUnansweredQs: [],
  });
  const [snackbarProps, setSnackbarProps] = React.useState<CustomSnackbarProps>(
    {
      autoHideDuration: 6000,
      isOpen: false,
      handleClose: onSnackbarClose,
      variant: 'success',
    }
  );

  const userTheme = user ? makeUserTheme(user.palette) : undefined;
  const userDarkTheme = user ? makeUserDarkTheme(user.palette) : undefined;

  const myUserId = props.user ? props.user._id : undefined;

  const screenSmallerThanMd = useMediaQuery(theme.breakpoints.down('sm'));
  const screenSmallerThanSm = useMediaQuery(theme.breakpoints.down('xs'));

  const getQuestions = async (user: User) => {
    const res = await getAllProfileQuestions();
    if (res.status === 200) {
      const questions = res.data;
      setQuestions(questions);
      const initQuestions = sortQuestions(user, questions);
      setInitQuestions(initQuestions);
    } else {
      // TODO: error handling
    }
  };

  useEffect(() => {
    getUser(userId).then(user => {
      if (user) {
        const isUserMe = myUserId === user._id;
        setUserIsMe(isUserMe);
        if (isUserMe) {
          getGenres();
          getQuestions(user);
        }
        // Setting max page size here so we get all the user's clubs
        getAllClubs(userId, undefined, 50).then(res => {
          if (!res.data) {
            // TODO: Error checking
          }
          const { clubs } = res.data;
          getUserShelf(user, clubs).then(shelf => {
            setUserShelf(shelf);
          });
          (async () => {
            setUserClubsTransformed(await transformClubs(clubs));
          })();
        });
      }
      setUser(user);
    });
  }, [userId, myUserId]);

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

  async function getGenres() {
    const res = await getAllGenres();
    if (res.status === 200) {
      setGenres(res.data);
    } else {
      // TODO: error handling
    }
  }

  function sortQuestions(user: User, questions: Services.GetProfileQuestions) {
    setUserQuestionsWkspc(user.questions);
    const initUnansweredQs: ProfileQuestion[] = [];
    const initAnsweredQs: UserQAwMinMax[] = [];
    const initQuestions = {
      initUnansweredQs,
      initAnsweredQs,
    };
    questions.questions.forEach(q => {
      const uq = user.questions.find(uq => uq.id === q.id);
      if (uq) {
        initQuestions.initAnsweredQs.push({ ...uq, min: q.min, max: q.max });
      } else {
        initQuestions.initUnansweredQs.push(q);
      }
    });
    return initQuestions;
  }

  async function getUserShelf(user: User, clubs: Services.GetClubs['clubs']) {
    const userShelf: UserShelfType = {
      current: [],
      notStarted: [],
      read: [],
    };
    clubs.forEach(c => {
      userShelf.current.push({
        ...c.shelf.current[0],
        clubId: c._id,
        club: c,
      });
    });
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
    const res = await getClubsByIdNoMembers(clubIdsArr);
    let rClubs: Services.GetClubs['clubs'] = [];
    if (res.status === 200) {
      rClubs = res.data.clubs;
    }
    if (rClubs.length === indices.length) {
      for (let i = 0; i < rClubs.length; i++) {
        userShelf.read[indices[i]].club = rClubs[i];
      }
    }
    return userShelf;
  }

  if (!user) {
    return (
      <div className={classes.loadingContainer}>
        Loading user...
        <CircularProgress />
      </div>
    );
  }

  const onEdit = (field: EditableUserField, newValue: any) => {
    if (user) {
      let writeChange = false;
      if (
        EditableUserFieldStringsArr.includes(field) &&
        typeof newValue === 'string'
      ) {
        writeChange = true;
      } else if (field === 'selectedGenres') {
        writeChange = true;
      } else if (field === 'shelf') {
        setUserShelf(newValue);
        setShelfModified(true);
      } else if (field === 'questions') {
        setQuestionsModified(true);
        setUserQuestionsWkspc(newValue);
      } else if (
        field === 'palette' &&
        typeof newValue.key === 'string' &&
        typeof newValue.textColor === 'string'
      ) {
        if (newValue.key === '#FFFFFF') {
          const userCopy: User = { ...user, [field]: null };
          setUser(userCopy);
        } else {
          writeChange = true;
        }
      }
      if (writeChange) {
        const userCopy: User = { ...user, [field]: newValue };
        setUser(userCopy);
      }
    }
  };

  const onSaveClick = async () => {
    let userToSend = user;
    if (questionsModified || shelfModified) {
      let userCopy: User = { ...user };
      if (questionsModified) {
        const userQuestionsAnswered = userQuestionsWkspc.filter(
          q => q.answer.split(' ').join('').length !== 0
        );
        userCopy = { ...userCopy, questions: userQuestionsAnswered };
        if (questions) {
          const initQuestions = sortQuestions(userCopy, questions);
          setInitQuestions(initQuestions);
        }
        setQuestionsModified(false);
      }
      if (shelfModified) {
        const userShelfNoCurrent = { ...userShelf };
        delete userShelfNoCurrent.current;
        userCopy = { ...userCopy, shelf: userShelfNoCurrent };
        setShelfModified(false);
      }
      setUser(userCopy);
      userToSend = userCopy;
    }
    const res = await modifyUser(userToSend);
    if (res.status === 200) {
      setSnackbarProps({
        ...snackbarProps,
        isOpen: true,
        variant: 'success',
        message: 'Successfully updated your profile!',
      });
    } else {
      // TODO: determine routing based on other values of res
      setSnackbarProps({
        ...snackbarProps,
        isOpen: true,
        variant: 'warning',
        message: 'We ran into some trouble saving your profile.',
      });
    }
    setIsEditing(false);
  };

  function onSnackbarClose() {
    setSnackbarProps({ ...snackbarProps, isOpen: false });
  }

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const formValidated = (): boolean => {
    return nameValidated()[0] && bioValidated()[0] && websiteValidated()[0];
  };

  const nameValidated = (): [boolean, string] => {
    const { length } = validationParams.name;
    if (!user) {
      return [false, 'Whoops! We seem to be missing your user data.'];
    }
    if (!user.name) {
      return [false, 'Please provide a name!'];
    }
    if (user.name.length < length.min || user.name.length > length.max) {
      return [
        false,
        `Length must be between ${length.min} and ${length.max} characters.`,
      ];
    }
    return [true, 'All good!'];
  };

  const bioValidated = (): [boolean, string] => {
    const { length } = validationParams.bio;
    if (!user) {
      return [false, 'Whoops! We seem to be missing your user data.'];
    }
    if (
      user.bio &&
      (user.bio.length < length.min || user.bio.length > length.max)
    ) {
      return [
        false,
        `Length must be between ${length.min} and ${length.max} characters.`,
      ];
    }
    return [true, 'All good!'];
  };

  const websiteValidated = (): [boolean, string] => {
    if (!user) {
      return [false, 'Whoops! We seem to be missing your user data.'];
    }
    if (user.website && user.website.length > 0 && !validURL(user.website)) {
      return [false, 'Please provide a valid URL!'];
    }
    return [true, 'All good!'];
  };

  // const QAValidated = (): [boolean, [boolean, string][]] => {
  //   // TODO: Can use this later if we want to validate QA answers beyond min/max length.
  //   return [true, [true, "All good!"]];
  // }

  function backButtonAction() {
    if (props.history.length > 2) {
      props.history.goBack();
    } else {
      props.history.replace('/');
    }
  }

  const leftComponent = (
    <MuiThemeProvider theme={userDarkTheme}>
      <IconButton
        edge="start"
        color={userDarkTheme ? 'primary' : 'inherit'}
        aria-label="Back"
        onClick={backButtonAction}
      >
        <BackIcon />
      </IconButton>
    </MuiThemeProvider>
  );

  const centerComponent = (
    <MuiThemeProvider theme={userDarkTheme}>
      <div className={classes.centerComponent}>
        <UserAvatar user={user} style={{ marginRight: theme.spacing(1) }} />
        <HeaderTitle title={user.name || 'User Profile'} />
      </div>
    </MuiThemeProvider>
  );

  const rightComponentFn = () => {
    if (!userIsMe) {
      return;
    } else {
      if (isEditing) {
        return (
          <MuiThemeProvider theme={userDarkTheme}>
            <IconButton
              edge="start"
              color={userDarkTheme ? 'primary' : 'inherit'}
              aria-label="More"
              disabled={!formValidated()}
              onClick={onSaveClick}
            >
              <SaveIcon />
            </IconButton>
          </MuiThemeProvider>
        );
      } else {
        return (
          <MuiThemeProvider theme={userDarkTheme}>
            <IconButton
              edge="start"
              color={userDarkTheme ? 'primary' : 'inherit'}
              aria-label="More"
              onClick={() => setIsEditing(true)}
            >
              <EditIcon />
            </IconButton>
          </MuiThemeProvider>
        );
      }
    }
  };

  return (
    <MuiThemeProvider theme={userTheme}>
      <Header
        leftComponent={leftComponent}
        centerComponent={scrolled > 64 ? centerComponent : undefined}
        rightComponent={rightComponentFn()}
        showBorder={scrolled > 1 ? true : false}
        userTheme={userTheme}
        userDarkTheme={userDarkTheme}
      />
      <div
        className={classes.nameplateContainer}
        style={{
          backgroundColor: userTheme
            ? userTheme.palette.primary.main
            : undefined,
        }}
      >
        <UserAvatar user={user} size={screenSmallerThanSm ? 112 : 144} />
        <div style={{ marginLeft: theme.spacing(2) }}>
          <UserNameplate
            user={user}
            userIsMe={userIsMe}
            isEditing={isEditing}
            onEdit={onEdit}
            valid={[nameValidated(), bioValidated(), websiteValidated()]}
            userDarkTheme={userDarkTheme}
          />
        </div>
      </div>
      <MuiThemeProvider theme={userDarkTheme}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant={screenSmallerThanMd ? 'fullWidth' : undefined}
          centered={!screenSmallerThanMd}
          className={classes.tabRoot}
          style={
            userTheme
              ? { backgroundColor: userTheme.palette.primary.main }
              : undefined
          }
        >
          <Tab label="Bio" />
          <Tab label="Shelf" />
          <Tab label="Clubs" />
        </Tabs>
      </MuiThemeProvider>
      <Container maxWidth={'md'}>
        <>
          {tabValue === 0 && (
            <UserBio
              user={user}
              userIsMe={userIsMe}
              isEditing={isEditing}
              onEdit={onEdit}
              genres={genres || undefined}
              initQuestions={initQuestions}
              userQuestionsWkspc={userQuestionsWkspc}
            />
          )}
          {tabValue === 1 && (
            <UserShelf
              user={user}
              userIsMe={userIsMe}
              shelf={userShelf}
              isEditing={isEditing}
              onEdit={onEdit}
            />
          )}
          {tabValue === 2 && (
            <UserClubs
              clubsTransformed={userClubsTransformed}
              user={user}
              userIsMe={userIsMe}
            />
          )}
        </>
      </Container>
      <CustomSnackbar {...snackbarProps} />
    </MuiThemeProvider>
  );
}
