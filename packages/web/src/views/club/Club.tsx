import React, { useEffect, SyntheticEvent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  ShelfEntry,
  User,
  MembershipStatus,
  Services,
  ClubReadingSchedule,
  FilterAutoMongoKeys,
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
      marginTop: theme.spacing(3),
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

type LoadableMemberStatus = MembershipStatus | 'loading';

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

export default function ClubComponent(props: ClubProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { user } = props;
  const clubId = props.match.params.id;

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
        // TODO: Investigate this line of code breaking the world
        // setMembershipStatus('member');
        const member = club.members.find(m => m._id === user._id);
        if (member) {
          setMembershipStatus(club.ownerId === user._id ? 'owner' : 'member');
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
    field:
      | 'bio'
      | 'maxMembers'
      | 'name'
      | 'readingSpeed'
      | 'vibe'
      | 'maxMembers',
    newValue: string | number
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
      duration: 4,
      discussionFrequency: 3,
      discussions: [],
    });
  };

  const onUpdateSchedule = (
    field: 'startDate' | 'duration' | 'discussionFrequency',
    newVal: Date | number | null
  ) => {
    if (!schedule) {
      throw new Error(
        'Attempted to set a schedule that had not yet been initialized!'
      );
    }
    setSchedule({ ...schedule, [field]: newVal });
  };

  // TODO: Add schedule shit to onSaveClick.
  const onSaveClick = async () => {
    if (!club) {
      return;
    }
    const res = await modifyClub(club);
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
    setIsEditing(false);
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
                <ShelfView shelf={club.shelf} isEditing={isEditing} />
              )}
              {tabValue === 2 && (
                <ScheduleView
                  initSchedule={initSchedule}
                  isEditing={isEditing}
                  onUpdateSchedule={onUpdateSchedule}
                  schedule={schedule}
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
