import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  Club,
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
import { getUsersById } from '../../services/user';
import { getCurrentBook } from './functions/ClubFunctions';
import ClubHero from './ClubHero';
import GroupView from './group-view/GroupView';
import ShelfView from './shelf-view/ShelfView';
import AdapterLink from '../../components/AdapterLink';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import Header from '../../components/Header';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {},
    root: {
      flexGrow: 1,
    },
    button: {
      marginTop: theme.spacing(3),
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
    },
  })
);

interface ClubRouteParams {
  id: string;
}

interface ClubProps extends RouteComponentProps<ClubRouteParams> {
  user: User | null;
}

export default function ClubComponent(props: ClubProps) {
  const classes = useStyles();
  const [tabValue, setTabValue] = React.useState(0);
  const [club, setClub] = React.useState<Services.GetClubById | null>(null);
  const [currBook, setCurrBook] = React.useState<ShelfEntry | null>(null);
  const [loadedClub, setLoadedClub] = React.useState<boolean>(false);
  const [memberInfo, setMemberInfo] = React.useState<User[]>([]);
  const [memberStatus, setMemberStatus] = React.useState<MembershipStatus>(
    'notMember'
  );
  const [loginModalShown, setLoginModalShown] = React.useState(false);
  const clubId = props.match.params.id;

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

  function onCloseLoginModal() {
    setLoginModalShown(false);
  }

  function handleChange(event: React.ChangeEvent<{}>, newValue: number) {
    setTabValue(newValue);
  }

  async function getMembersInfo(club: Services.GetClubById | null) {
    if (club && club.members) {
      const memberIds = club.members.map(m => m.id);
      const users = await getUsersById(memberIds);
      if (users) {
        const membersWithInfo = users.map(u => {
          const member = club.members.find(m => m.id === u._id);
          if (!member) {
            throw Error('Should not happen');
          }
          return { ...u, roles: member.roles };
        });
        setMemberInfo(membersWithInfo);
      }
    }
  }

  async function addOrRemoveMeFromClub(action: 'add' | 'remove') {
    if (action === 'add') {
      const result = await modifyMyClubMembership(clubId, true);
      if (result === 200) {
        setMemberStatus('member');
      }
    } else if (action === 'remove') {
      const result = await modifyMyClubMembership(clubId, false);
      if (result === 200) {
        setMemberStatus('notMember');
      }
    }
  }

  useEffect(() => {
    const getClubFun = async () => {
      try {
        const club = await getClub(clubId);
        setClub(club);
        if (club) {
          const currBook = getCurrentBook(club);
          setCurrBook(currBook);
          getMembersInfo(club);
          setLoadedClub(true);
        }
      } catch (err) {
        console.error(err);
        setLoadedClub(true);
      }
    };
    getClubFun();
  }, [clubId, memberStatus]);

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
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Group" />
              <Tab label="Shelf" />
            </Tabs>
          </Paper>
          <Container maxWidth="lg">
            <div className={classes.contentContainer}>
              {tabValue === 0 && (
                <GroupView club={club} memberInfo={memberInfo} />
              )}
              {tabValue === 1 && <ShelfView shelf={club.shelf} />}
              <div className={classes.buttonsContainer}>
                {memberStatus === 'notMember' && (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() =>
                      props.user
                        ? addOrRemoveMeFromClub('add')
                        : setLoginModalShown(true)
                    }
                    disabled={false}
                    //TODO make this disabled be based on max members vs actual members
                  >
                    JOIN CLUB
                  </Button>
                )}
                {memberStatus === 'member' && (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                  >
                    OPEN CHAT
                  </Button>
                )}
                {memberStatus === 'owner' && (
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
      {loginModalShown && (
        <DiscordLoginModal onCloseLoginModal={onCloseLoginModal} />
      )}
    </>
  );
}
