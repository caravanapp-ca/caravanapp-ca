import React, { useEffect, SyntheticEvent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { eachDayOfInterval, addDays } from 'date-fns/esm';
import {
  ShelfEntry,
  User,
  LoadableMemberStatus,
  Services,
  ClubReadingSchedule,
  FilterAutoMongoKeys,
  Discussion,
  SelectedGenre,
  ClubWUninitSchedules,
} from '@caravan/buddy-reading-types';
import {
  Paper,
  Tabs,
  Tab,
  Button,
  Typography,
  CircularProgress,
  Container,
  useMediaQuery,
  Fab,
  IconButton,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Create';
import SaveIcon from '@material-ui/icons/Save';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import ChatIcon from '@material-ui/icons/Chat';
import JoinIcon from '@material-ui/icons/PersonAdd';
import {
  makeStyles,
  createStyles,
  useTheme,
  Theme,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import {
  getClub,
  modifyMyClubMembership,
  deleteClub,
  modifyClub,
} from '../../services/club';
import { getCurrentBook, getCurrentSchedule } from './functions/ClubFunctions';
import ClubHero from './ClubHero';
import GroupView from './group-view/GroupView';
import ShelfView from './shelf-view/ShelfView';
import AdapterLink from '../../components/AdapterLink';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import ClubLeaveDialog from './ClubLeaveDialog';
import Header from '../../components/Header';
import HeaderTitle from '../../components/HeaderTitle';
import { errorTheme } from '../../theme';
import ClubDisbandDialog from './ClubDisbandDialog';
import CustomSnackbar, {
  CustomSnackbarProps,
} from '../../components/CustomSnackbar';
import ProfileHeaderIcon from '../../components/ProfileHeaderIcon';
import ScheduleView from './schedule-view/ScheduleView';
import { getAllGenres } from '../../services/genre';
import {
  defaultClubScheduleDuration,
  defaultClubScheduleDiscussionFreq,
} from '../../common/globalConstants';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {},
    root: {
      position: 'relative',
      zIndex: 1,
      flexGrow: 1,
      backgroundColor: '#FFFFFF',
    },
    button: {
      margin: theme.spacing(1),
    },
    input: {
      display: 'none',
    },
    progress: {
      margin: theme.spacing(2),
    },
    contentContainer: {
      flexGrow: 1,
    },
    buttonsContainer: {
      width: '100%',
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    fabContainer: {
      display: 'flex',
      flexDirection: 'row',
      position: 'absolute',
      top: 84,
      right: theme.spacing(4),
    },
    fab: {},
  })
);

interface ClubRouteParams {
  id: string;
}

interface ClubProps extends RouteComponentProps<ClubRouteParams> {
  user: User | null;
}
const showJoinClub = (
  memberStatus: LoadableMemberStatus,
  club: Services.GetClubById
) =>
  memberStatus === 'notMember' &&
  club &&
  club.members &&
  club.maxMembers > club.members.length;
const showOpenChat = (memberStatus: LoadableMemberStatus) =>
  memberStatus === 'owner' || memberStatus === 'member';
const showInviteFriends = (memberStatus: LoadableMemberStatus) =>
  memberStatus === 'owner' || memberStatus === 'member';
const showUpdateBook = (memberStatus: LoadableMemberStatus) =>
  memberStatus === 'owner';
const showDisbandClub = (memberStatus: LoadableMemberStatus) =>
  memberStatus === 'owner';
const showLeaveClub = (memberStatus: LoadableMemberStatus) =>
  memberStatus === 'member';
const getChatUrl = (club: Services.GetClubById, inApp: boolean) =>
  inApp
    ? `discord:/channels/${club.guildId}/${club.channelId}`
    : `https://discordapp.com/channels/${club.guildId}/${club.channelId}`;
const openChat = (club: Services.GetClubById, inApp: boolean) => {
  if (inApp) {
    window.location.href = getChatUrl(club, inApp);
  } else {
    window.open(getChatUrl(club, inApp), '_blank');
  }
};

const generateDiscussions = (
  schedule: FilterAutoMongoKeys<ClubReadingSchedule>
): Discussion[] => {
  const { discussionFrequency, discussions, duration, startDate } = schedule;
  if (discussionFrequency && duration && startDate) {
    const durationInDays = duration * 7;
    const readingDays = eachDayOfInterval({
      start: startDate,
      end: addDays(startDate, durationInDays),
    });
    const newDiscussions: Discussion[] = [];
    let loopIndex = 0;
    for (
      let i = discussionFrequency;
      i < readingDays.length;
      i = i + discussionFrequency
    ) {
      newDiscussions.push({
        date: readingDays[i],
        label:
          loopIndex < discussions.length ? discussions[loopIndex].label : '',
        format:
          loopIndex < discussions.length
            ? discussions[loopIndex].format
            : 'text',
      });
      loopIndex += 1;
    }
    return newDiscussions;
  } else {
    return [];
  }
};

export default function ClubComponent(props: ClubProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { user } = props;
  const clubId = props.match.params.id;

  const [genres, setGenres] = React.useState<Services.GetGenres | null>(null);
  const [tabValue, setTabValue] = React.useState(0);
  const [club, setClub] = React.useState<Services.GetClubById | null>(null);
  const [currBook, setCurrBook] = React.useState<ShelfEntry | null>(null);
  const [schedule, setSchedule] = React.useState<
    ClubReadingSchedule | FilterAutoMongoKeys<ClubReadingSchedule> | null
  >(null);
  const [loadedClub, setLoadedClub] = React.useState<boolean>(false);
  const [loginDialogVisible, setLoginDialogVisible] = React.useState<boolean>(
    false
  );
  const [leaveDialogVisible, setLeaveDialogVisible] = React.useState<boolean>(
    false
  );
  const [disbandDialogVisible, setDisbandDialogVisible] = React.useState<
    boolean
  >(false);
  const [memberStatus, setMembershipStatus] = React.useState<
    LoadableMemberStatus
  >('loading');
  const [snackbarProps, setSnackbarProps] = React.useState<CustomSnackbarProps>(
    {
      autoHideDuration: 6000,
      isOpen: false,
      handleClose: onSnackbarClose,
      variant: 'info',
    }
  );
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [madeScheduleChanges, setMadeScheduleChanges] = React.useState<boolean>(
    true
  );

  const screenSmallerThanMd = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    async function getClubFun() {
      try {
        const club = await getClub(clubId);
        setClub(club);
        if (club) {
          const currBook = getCurrentBook(club);
          setCurrBook(currBook);
          if (currBook) {
            const schedule = getCurrentSchedule(club, currBook);
            setSchedule(schedule);
          } else {
            setSchedule(null);
          }
          setLoadedClub(true);
        }
      } catch (err) {
        console.error(err);
        setLoadedClub(true);
      }
    }
    getClubFun();
  }, [clubId]);

  useEffect(() => {
    if (club) {
      if (user) {
        const member = club.members.find(m => m._id === user._id);
        if (member) {
          if (club.ownerId === user._id) {
            setMembershipStatus('owner');
            getGenres();
          } else {
            setMembershipStatus('member');
          }
        } else {
          setMembershipStatus('notMember');
        }
      } else {
        setMembershipStatus('notMember');
      }
    }
  }, [club, user]);

  if (loadedClub && !club) {
    return (
      <Container maxWidth="md">
        <Typography>Whoops! It doesn't look like this club exists!</Typography>
      </Container>
    );
  }

  const getGenres = async () => {
    const res = await getAllGenres();
    if (res.status === 200) {
      setGenres(res.data);
    } else {
      // TODO: error handling
    }
  };

  const onGenreClick = (key: string, currActive: boolean) => {
    if (!genres || !club) {
      return;
    }
    let selectedGenresNew: SelectedGenre[];
    if (!currActive) {
      selectedGenresNew = [...club.genres];
      selectedGenresNew.push({
        key,
        name: genres.genres[key].name,
      });
    } else {
      selectedGenresNew = club.genres.filter(sg => sg.key !== key);
    }
    setClub({ ...club, genres: selectedGenresNew });
  };

  function backButtonAction() {
    if (props.history.length > 1) {
      props.history.goBack();
    } else {
      props.history.replace('/');
    }
  }

  const leftComponent = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="Back"
      onClick={backButtonAction}
    >
      <BackIcon />
    </IconButton>
  );

  const centerComponent = club ? (
    <HeaderTitle title={club.name} />
  ) : (
    <HeaderTitle title="Club Homepage" />
  );

  const rightComponent = (memberStatus: LoadableMemberStatus): JSX.Element => {
    if (memberStatus === 'owner') {
      if (isEditing) {
        return (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="More"
            onClick={onSaveClick}
            disabled={!club}
          >
            <SaveIcon />
          </IconButton>
        );
      } else {
        return (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="More"
            onClick={() => setIsEditing(true)}
          >
            <EditIcon />
          </IconButton>
        );
      }
    } else {
      return <ProfileHeaderIcon user={user} />;
    }
  };

  function onSnackbarClose(event?: SyntheticEvent, reason?: string) {
    setSnackbarProps({ ...snackbarProps, isOpen: false });
  }

  const onEdit = (
    field: 'bio' | 'maxMembers' | 'name' | 'readingSpeed' | 'unlisted' | 'vibe',
    newValue: string | number | boolean
  ) => {
    if (!club) {
      return;
    }
    const newClub: Services.GetClubById = { ...club, [field]: newValue };
    setClub(newClub);
  };

  const initSchedule = () => {
    if (!currBook || !currBook._id) {
      throw new Error(
        'Attempted to initiate schedule without a current book selected!'
      );
    }
    setSchedule({
      shelfEntryId: currBook._id,
      startDate: null,
      duration: defaultClubScheduleDuration,
      discussionFrequency: defaultClubScheduleDiscussionFreq,
      discussions: [],
    });
  };

  const onUpdateSchedule = (
    field: 'startDate' | 'duration' | 'discussionFrequency' | 'label',
    newVal: Date | number | string | null,
    index?: number
  ) => {
    if (!schedule) {
      throw new Error(
        'Attempted to set a schedule that had not yet been initialized!'
      );
    }
    if (field !== 'label') {
      const newSchedule: FilterAutoMongoKeys<ClubReadingSchedule> = {
        ...schedule,
        [field]: newVal,
      };
      const newDiscussions = generateDiscussions(newSchedule);
      setSchedule({
        ...newSchedule,
        discussions: newDiscussions,
      });
      setMadeScheduleChanges(true);
    } else if (
      field === 'label' &&
      typeof index === 'number' &&
      index >= 0 &&
      typeof newVal === 'string'
    ) {
      let discussionsNew = [...schedule.discussions];
      discussionsNew[index].label = newVal;
      setSchedule({ ...schedule, discussions: discussionsNew });
      setMadeScheduleChanges(true);
    } else {
      throw new Error(
        `Illegal params passed to onUpdateSchedule! field: ${field}, newVal: ${newVal}, index: ${index}`
      );
    }
  };

  const onSaveClick = async () => {
    if (!club) {
      return;
    }
    const clubCopy: ClubWUninitSchedules = { ...club };
    let nullSchedule = false;
    if (madeScheduleChanges && currBook && schedule) {
      let scheduleCopy: (
        | ClubReadingSchedule
        | FilterAutoMongoKeys<ClubReadingSchedule>)[] = [...club.schedules];
      if (schedule.startDate == null || schedule.duration == null) {
        nullSchedule = true;
      } else {
        const currScheduleIndex = club.schedules.findIndex(
          sched => sched.shelfEntryId === currBook._id
        );
        if (currScheduleIndex >= 0) {
          scheduleCopy[currScheduleIndex] = schedule;
        } else {
          scheduleCopy.push(schedule);
        }
      }
      clubCopy.schedules = scheduleCopy;
    }
    const res = await modifyClub(clubCopy);
    if (res.status === 200) {
      setSnackbarProps({
        ...snackbarProps,
        isOpen: true,
        variant: 'success',
        message: 'Successfully updated your club!',
      });
    } else {
      // TODO: determine routing based on other values of res
      setSnackbarProps({
        ...snackbarProps,
        isOpen: true,
        variant: 'warning',
        message: 'We ran into some trouble saving your club.',
      });
    }
    if (nullSchedule) {
      await setIsEditing(false);
      setSchedule(null);
    } else {
      setIsEditing(false);
    }
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const handleClubLeaveDialog = (confirm: boolean) => {
    setLeaveDialogVisible(false);
    if (confirm) {
      addOrRemoveMeFromClub('remove');
    }
  };

  const disbandClub = async () => {
    setDisbandDialogVisible(false);
    const res = await deleteClub(clubId);
    if (res.status === 204) {
      // club successfully deleted
      props.history.replace('/clubs');
    } else {
      // club not deleted successfully
      setSnackbarProps(s => ({
        ...s,
        isOpen: true,
        variant: 'warning',
        message:
          'Whoops! Something has gone wrong and Caravan was unable to delete your club.',
      }));
    }
  };

  const copyToClipboard = (str: string) => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setSnackbarProps({
      ...snackbarProps,
      isOpen: true,
      variant: 'info',
      message: 'Copied link to clipboard!',
    });
  };

  async function addOrRemoveMeFromClub(action: 'add' | 'remove') {
    const addMember = action === 'add';
    const result = await modifyMyClubMembership(clubId, addMember);
    if (result.status >= 200 && result.status < 300) {
      if (club) {
        const newClub: Services.GetClubById = {
          ...club,
          members: result.data,
        };
        setClub(newClub);
      }
    }
  }

  return (
    <>
      {!loadedClub && <CircularProgress className={classes.progress} />}
      {loadedClub && club && (
        <div>
          <Header
            leftComponent={leftComponent}
            centerComponent={centerComponent}
            rightComponent={rightComponent(memberStatus)}
          />
          {currBook && <ClubHero currBook={currBook} />}
          <Paper className={classes.root}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant={screenSmallerThanMd ? 'fullWidth' : undefined}
              centered={!screenSmallerThanMd}
            >
              <Tab label="Group" />
              <Tab label="Shelf" />
              <Tab label="Schedule" />
            </Tabs>
          </Paper>
          <Container maxWidth="md">
            <div className={classes.contentContainer}>
              {tabValue === 0 && (
                <GroupView club={club} isEditing={isEditing} onEdit={onEdit} />
              )}
              {tabValue === 1 && (
                <ShelfView
                  genres={genres || undefined}
                  isEditing={isEditing}
                  onGenreClick={onGenreClick}
                  shelf={club.shelf}
                  selectedGenres={club.genres}
                />
              )}
              {tabValue === 2 && (
                <ScheduleView
                  currBook={currBook}
                  initSchedule={initSchedule}
                  isEditing={isEditing}
                  madeScheduleChanges={madeScheduleChanges}
                  memberStatus={memberStatus}
                  onUpdateSchedule={onUpdateSchedule}
                  schedule={schedule}
                  setIsEditing={setIsEditing}
                />
              )}
              <div className={classes.buttonsContainer}>
                {showJoinClub(memberStatus, club) && (
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={() =>
                      props.user
                        ? addOrRemoveMeFromClub('add')
                        : setLoginDialogVisible(true)
                    }
                    disabled={false}
                    //TODO make this disabled be based on max members vs actual members
                  >
                    <Typography
                      variant="button"
                      style={{ textAlign: 'center' }}
                    >
                      JOIN CLUB
                    </Typography>
                  </Button>
                )}
                {showOpenChat(memberStatus) && (
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={() => openChat(club, false)}
                  >
                    <Typography
                      variant="button"
                      style={{ textAlign: 'center' }}
                    >
                      OPEN CHAT IN WEB
                    </Typography>
                  </Button>
                )}
                {showOpenChat(memberStatus) && (
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={() => openChat(club, true)}
                  >
                    <Typography
                      variant="button"
                      style={{ textAlign: 'center' }}
                    >
                      OPEN CHAT IN APP
                    </Typography>
                  </Button>
                )}
                {showInviteFriends(memberStatus) && (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => copyToClipboard(window.location.href)}
                  >
                    <Typography
                      variant="button"
                      style={{ textAlign: 'center' }}
                    >
                      INVITE TO CLUB
                    </Typography>
                  </Button>
                )}
                {showUpdateBook(memberStatus) && (
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.button}
                    component={AdapterLink}
                    to={`${clubId}/manage-shelf`}
                  >
                    <Typography
                      variant="button"
                      style={{ textAlign: 'center' }}
                    >
                      MANAGE SHELF
                    </Typography>
                  </Button>
                )}
                {showLeaveClub(memberStatus) && (
                  <MuiThemeProvider theme={errorTheme}>
                    <Button
                      color="primary"
                      className={classes.button}
                      variant="outlined"
                      onClick={() => setLeaveDialogVisible(true)}
                    >
                      <Typography
                        variant="button"
                        style={{ textAlign: 'center' }}
                      >
                        LEAVE CLUB
                      </Typography>
                    </Button>
                  </MuiThemeProvider>
                )}
                {showDisbandClub(memberStatus) && (
                  <MuiThemeProvider theme={errorTheme}>
                    <Button
                      variant="outlined"
                      color="primary"
                      className={classes.button}
                      onClick={() => setDisbandDialogVisible(true)}
                    >
                      <Typography
                        variant="button"
                        style={{ textAlign: 'center' }}
                      >
                        DISBAND CLUB
                      </Typography>
                    </Button>
                  </MuiThemeProvider>
                )}
              </div>
            </div>
          </Container>
          {showJoinClub(memberStatus, club) && (
            <div className={classes.fabContainer}>
              <Fab
                color="secondary"
                className={classes.fab}
                onClick={() =>
                  props.user
                    ? addOrRemoveMeFromClub('add')
                    : setLoginDialogVisible(true)
                }
              >
                <JoinIcon />
              </Fab>
            </div>
          )}
          {showOpenChat(memberStatus) && (
            <div className={classes.fabContainer}>
              <Fab
                color="secondary"
                className={classes.fab}
                onClick={() => openChat(club, false)}
              >
                <ChatIcon />
              </Fab>
            </div>
          )}
        </div>
      )}
      <DiscordLoginModal
        open={loginDialogVisible}
        onCloseLoginDialog={() => setLoginDialogVisible(false)}
      />
      <ClubLeaveDialog
        open={leaveDialogVisible}
        onCancel={() => handleClubLeaveDialog(false)}
        onConfirm={() => handleClubLeaveDialog(true)}
      />
      <ClubDisbandDialog
        open={disbandDialogVisible}
        onCancel={() => setDisbandDialogVisible(false)}
        onDisbandSelect={disbandClub}
      />
      <CustomSnackbar {...snackbarProps} />
    </>
  );
}
