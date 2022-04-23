import { addDays, eachDayOfInterval } from 'date-fns';
import React, { SyntheticEvent, useEffect } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import {
  ClubBotSettings,
  ClubReadingSchedule,
  ClubWUninitSchedules,
  Discussion,
  FilterAutoMongoKeys,
  LoadableMemberStatus,
  SelectedGenre,
  Services,
  ShelfEntry,
  User,
} from '@caravanapp/types';
import {
  Button,
  CircularProgress,
  Container,
  createStyles,
  Fab,
  IconButton,
  makeStyles,
  MuiThemeProvider,
  Paper,
  Tab,
  Tabs,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import {
  ArrowBackIos as BackIcon,
  Chat as ChatIcon,
  Create as EditIcon,
  PersonAdd as JoinIcon,
  Save as SaveIcon,
} from '@material-ui/icons';

import {
  DEFAULT_DISCUSSION_FREQ_DAYS,
  DEFAULT_SCHEDULE_DURATION_WEEKS,
  UNLIMITED_CLUB_MEMBERS_VALUE,
} from '../../common/globalConstants';
import AdapterLink from '../../components/AdapterLink';
import CustomSnackbar, {
  CustomSnackbarProps,
} from '../../components/CustomSnackbar';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import Header from '../../components/Header';
import HeaderTitle from '../../components/HeaderTitle';
import ProfileHeaderIcon from '../../components/ProfileHeaderIcon';
import {
  deleteClub,
  getClub,
  modifyClub,
  modifyMyClubMembership,
} from '../../services/club';
import { getAllGenres } from '../../services/genre';
import { errorTheme } from '../../theme';
import ClubDisbandDialog from './ClubDisbandDialog';
import ClubHero from './ClubHero';
import ClubLeaveDialog from './ClubLeaveDialog';
import { getCurrentSchedule } from './functions/ClubFunctions';
import GroupView from './group-view/GroupView';
import ScheduleView from './schedule-view/ScheduleView';
import ShelfView from './shelf-view/ShelfView';

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
    notFoundContainer: {
      padding: theme.spacing(4),
    },
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
  (club.maxMembers === UNLIMITED_CLUB_MEMBERS_VALUE ||
    club.maxMembers > club.members.length);
const showOpenChat = (memberStatus: LoadableMemberStatus) =>
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
    : `https://discord.com/channels/${club.guildId}/${club.channelId}`;
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
  const { discussions, duration, startDate, discussionFrequency } = schedule;
  if (discussionFrequency && discussionFrequency > 0 && duration && startDate) {
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
  const history = useHistory();
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
  const [loginDialogVisible, setLoginDialogVisible] =
    React.useState<boolean>(false);
  const [leaveDialogVisible, setLeaveDialogVisible] =
    React.useState<boolean>(false);
  const [disbandDialogVisible, setDisbandDialogVisible] =
    React.useState<boolean>(false);
  const [memberStatus, setMembershipStatus] =
    React.useState<LoadableMemberStatus>('loading');
  const [snackbarProps, setSnackbarProps] = React.useState<CustomSnackbarProps>(
    {
      autoHideDuration: 6000,
      isOpen: false,
      handleClose: onSnackbarClose,
      variant: 'info',
    }
  );
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [madeScheduleChanges, setMadeScheduleChanges] =
    React.useState<boolean>(true);

  const screenSmallerThanMd = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    async function getClubFun() {
      try {
        const club = await getClub(clubId);
        setClub(club);
        if (club) {
          const currentlyReadingBook = club.newShelf.current[0];
          if (club.newShelf.current.length > 0) {
            setCurrBook(currentlyReadingBook);
          }
          if (currentlyReadingBook) {
            const schedule = getCurrentSchedule(club, currentlyReadingBook);
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
    if (history.length > 2) {
      history.goBack();
    } else {
      history.replace('/');
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

  if (loadedClub && !club) {
    return (
      <>
        <Header
          leftComponent={leftComponent}
          centerComponent={centerComponent}
        />
        <Container maxWidth="md" className={classes.notFoundContainer}>
          <Typography>
            Whoops! It doesn't look like this club exists!
          </Typography>
        </Container>
      </>
    );
  }

  function onSnackbarClose(event?: SyntheticEvent, reason?: string) {
    setSnackbarProps({ ...snackbarProps, isOpen: false });
  }

  const onEdit = (
    field:
      | 'bio'
      | 'botSettings'
      | 'maxMembers'
      | 'name'
      | 'readingSpeed'
      | 'unlisted'
      | 'vibe',
    newValue: string | number | boolean | ClubBotSettings
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
      duration: DEFAULT_SCHEDULE_DURATION_WEEKS,
      discussionFrequency: DEFAULT_DISCUSSION_FREQ_DAYS,
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

  const onCustomUpdateSchedule = (
    newSchedule: ClubReadingSchedule | FilterAutoMongoKeys<ClubReadingSchedule>
  ) => {
    setSchedule(newSchedule);
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
        | FilterAutoMongoKeys<ClubReadingSchedule>
      )[] = [...club.schedules];
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
      history.replace('/clubs');
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

  function onCopyReferralLink() {
    setSnackbarProps({
      ...snackbarProps,
      isOpen: true,
      variant: 'info',
      message: 'Copied referral link to clipboard!',
    });
  }

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
        const successfulSnackBarMessage = addMember
          ? "Successfully joined club! Refresh the page if you're still not shown as a member."
          : "Successfully  left club. Refresh the page if you're still shown as a member.";
        setSnackbarProps({
          ...snackbarProps,
          isOpen: true,
          variant: 'success',
          message: successfulSnackBarMessage,
        });
      }
    } else {
      const unsuccessfulSnackBarMessageVerb = addMember ? 'joining' : 'leaving';
      setSnackbarProps({
        ...snackbarProps,
        isOpen: true,
        variant: 'warning',
        message: `We ran into some trouble ${unsuccessfulSnackBarMessageVerb}. Try logging out then back in, or contact the Caravan team on Discord.`,
      });
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
          {currBook && (
            <ClubHero
              currBook={currBook}
              clubId={club._id}
              user={user}
              onCopyReferralLink={onCopyReferralLink}
            />
          )}
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
                  shelf={club.newShelf}
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
                  onCustomUpdateSchedule={onCustomUpdateSchedule}
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
                      user
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
                  user
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
