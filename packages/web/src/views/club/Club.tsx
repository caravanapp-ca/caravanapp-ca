import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  ShelfEntry,
  User,
  MembershipStatus,
  Services,
} from '@caravan/buddy-reading-types';
import {
  Paper,
  Tabs,
  Tab,
  Button,
  Typography,
  CircularProgress,
  Container,
} from '@material-ui/core';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { getClub, modifyMyClubMembership } from '../../services/club';
import { getCurrentBook } from './functions/ClubFunctions';
import ClubHero from './ClubHero';
import GroupView from './group-view/GroupView';
import ShelfView from './shelf-view/ShelfView';
import AdapterLink from '../../components/AdapterLink';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import ClubLeaveDialog from './ClubLeaveDialog';
import Header from '../../components/Header';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {},
    root: {
      flexGrow: 1,
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
      padding: theme.spacing(2),
    },
    buttonsContainer: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing(3),
    },
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
const showUpdateBook = (memberStatus: LoadableMemberStatus) =>
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
  const { user } = props;
  const clubId = props.match.params.id;

  const [tabValue, setTabValue] = React.useState(0);
  const [club, setClub] = React.useState<Services.GetClubById | null>(null);
  const [currBook, setCurrBook] = React.useState<ShelfEntry | null>(null);
  const [loadedClub, setLoadedClub] = React.useState<boolean>(false);
  const [loginDialogVisible, setLoginDialogVisible] = React.useState(false);
  const [leaveDialogVisible, setLeaveDialogVisible] = React.useState(false);
  const [memberStatus, setMembershipStatus] = React.useState<
    LoadableMemberStatus
  >('loading');

  useEffect(() => {
    if (user && club) {
      const member = club.members.find(m => m.userId === user._id);
      if (member) {
        setMembershipStatus(club.ownerId === user._id ? 'owner' : 'member');
      } else {
        setMembershipStatus('notMember');
      }
    } else {
      setMembershipStatus('notMember');
    }
  }, [club, user]);

  useEffect(() => {
    const getClubFun = async () => {
      try {
        const club = await getClub(clubId);
        setClub(club);
        if (club) {
          const currBook = getCurrentBook(club);
          setCurrBook(currBook);
          setLoadedClub(true);
        }
      } catch (err) {
        console.error(err);
        setLoadedClub(true);
      }
    };
    getClubFun();
  }, [clubId, memberStatus]);

  const leftComponent = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="Back"
      component={AdapterLink}
      to="/"
    >
      <BackIcon />
    </IconButton>
  );

  const centerComponent = club ? (
    <Typography variant="h6">{club.name}</Typography>
  ) : (
    <Typography variant="h6">Club Homepage</Typography>
  );

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const handleClubLeaveDialog = (confirm: boolean) => {
    setLeaveDialogVisible(false);
    if (confirm) {
      addOrRemoveMeFromClub('remove');
    }
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
          />
          {currBook && <ClubHero currBook={currBook} />}
          <Paper className={classes.root}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Group" />
              <Tab label="Shelf" />
            </Tabs>
          </Paper>
          <Container maxWidth="md">
            <div className={classes.contentContainer}>
              {tabValue === 0 && <GroupView club={club} />}
              {tabValue === 1 && <ShelfView shelf={club.shelf} />}
              <div className={classes.buttonsContainer}>
                {showJoinClub(memberStatus, club) && (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() =>
                      props.user
                        ? addOrRemoveMeFromClub('add')
                        : setLoginDialogVisible(true)
                    }
                    disabled={false}
                    //TODO make this disabled be based on max members vs actual members
                  >
                    JOIN CLUB
                  </Button>
                )}
                {showOpenChat(memberStatus) && (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => openChat(club, false)}
                  >
                    OPEN CHAT IN WEB
                  </Button>
                )}
                {showOpenChat(memberStatus) && (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => openChat(club, true)}
                  >
                    OPEN CHAT IN APP
                  </Button>
                )}
                {showLeaveClub(memberStatus) && (
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={() => setLeaveDialogVisible(true)}
                  >
                    LEAVE CLUB
                  </Button>
                )}
                {showUpdateBook(memberStatus) && (
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.button}
                    component={AdapterLink}
                    to={`${clubId}/updatebook`}
                  >
                    UPDATE BOOK
                  </Button>
                )}
              </div>
            </div>
          </Container>
        </div>
      )}
      {loadedClub && !club && (
        <div>
          <Typography>It does not appear that this club exists!</Typography>
        </div>
      )}
      {loginDialogVisible && (
        <DiscordLoginModal
          onCloseLoginDialog={() => setLoginDialogVisible(false)}
        />
      )}
      {leaveDialogVisible && (
        <ClubLeaveDialog
          onCancel={() => handleClubLeaveDialog(false)}
          onConfirm={() => handleClubLeaveDialog(true)}
        />
      )}
    </>
  );
}
