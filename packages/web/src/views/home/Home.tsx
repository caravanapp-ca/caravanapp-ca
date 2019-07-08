import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Fab } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { User, ShelfEntry, Services } from '@caravan/buddy-reading-types';
import AdapterLink from '../../components/AdapterLink';
import Header from '../../components/Header';
import { logout } from '../../services/user';
import JoinCaravanButton from '../../components/JoinCaravanButton';
import { KEY_HIDE_WELCOME_CLUBS } from '../../common/localStorage';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import { getAllClubs } from '../../services/club';
import { Service } from '../../common/service';
import ClubCards from './ClubCards';
import logo from '../../resources/logo.svg';
import GenericGroupMemberAvatar from '../../components/misc-avatars-icons-labels/avatars/GenericGroupMemberAvatar';

interface HomeProps extends RouteComponentProps<{}> {
  user: User | null;
}

export interface ClubWithCurrentlyReading {
  club: Services.GetClubs['clubs'][0];
  currentlyReading: ShelfEntry | null;
}

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  headerAvatar: {
    marginLeft: 12,
    width: 32,
    height: 32,
  },
  headerArrowDown: {
    height: 20,
    width: 20,
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  bottomAuthButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(1),
  },
}));

export function transformClubsToWithCurrentlyReading(
  clubs: Services.GetClubs['clubs']
): ClubWithCurrentlyReading[] {
  const clubsWCR: ClubWithCurrentlyReading[] = clubs.map(club => {
    const currentlyReading = club.shelf.find(
      book => book.readingState === 'current'
    );
    if (currentlyReading) {
      return { club, currentlyReading };
    } else {
      return { club, currentlyReading: null };
    }
  });
  return clubsWCR;
}

export default function Home(props: HomeProps) {
  const classes = useStyles();
  const { user } = props;

  const [clubsWCRResult, setClubsWCRResult] = React.useState<
    Service<ClubWithCurrentlyReading[]>
  >({ status: 'loading' });
  const [showWelcomeMessage, setShowWelcomeMessage] = React.useState(
    localStorage.getItem(KEY_HIDE_WELCOME_CLUBS) !== 'yes'
  );
  const headerProfileAnchorRef = React.useRef<HTMLDivElement>(null);

  const [loginModalShown, setLoginModalShown] = React.useState(false);

  const [afterQuery, setAfterQuery] = React.useState<string | undefined>(
    undefined
  );
  const [showLoadMore, setShowLoadMore] = React.useState(false);

  const [
    headerProfileMenuIsOpen,
    setHeaderProfileMenuOpenState,
  ] = React.useState(false);

  useEffect(() => {
    if (!showWelcomeMessage) {
      localStorage.setItem(KEY_HIDE_WELCOME_CLUBS, 'yes');
    }
  }, [showWelcomeMessage]);

  useEffect(() => {
    (async () => {
      const pageSize = 50;
      const res = await getAllClubs(afterQuery, pageSize);
      if (res.data) {
        const newClubsWCR = transformClubsToWithCurrentlyReading(
          res.data.clubs
        );
        if (newClubsWCR.length === pageSize) {
          setShowLoadMore(true);
        }
        setClubsWCRResult(s => ({
          status: 'loaded',
          payload:
            s.status === 'loaded'
              ? [...s.payload, ...newClubsWCR]
              : newClubsWCR,
        }));
      }
    })();
  }, [afterQuery]);

  function onCloseLoginModal() {
    setLoginModalShown(false);
  }

  function handleProfileClick() {
    setHeaderProfileMenuOpenState(isOpen => !isOpen);
  }

  function handleProfileMenuClose(event: React.MouseEvent<EventTarget>) {
    if (
      headerProfileAnchorRef.current &&
      headerProfileAnchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setHeaderProfileMenuOpenState(false);
  }

  function navigateToYourProfile() {
    if (user) {
      props.history.push(`/user/${user.urlSlug}`);
    }
  }

  function openChat() {
    window.open(
      'https://discordapp.com/channels/592761082523680798/592761082523680806',
      '_blank'
    );
  }

  const centerComponent = (
    <img
      src={logo}
      alt="Caravan logo"
      style={{ height: 20, objectFit: 'contain' }}
    />
  );

  const rightComponent = (
    <>
      <Tooltip title="Create club" aria-label="Create club">
        {user ? (
          <IconButton
            edge="start"
            color="primary"
            aria-label="Add"
            component={AdapterLink}
            to="/clubs/create"
          >
            <AddIcon />
          </IconButton>
        ) : (
          <IconButton
            edge="start"
            color="primary"
            aria-label="Add"
            onClick={() => setLoginModalShown(true)}
          >
            <AddIcon />
          </IconButton>
        )}
      </Tooltip>
      {user ? (
        <div
          onClick={handleProfileClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          ref={headerProfileAnchorRef}
        >
          <Avatar
            alt={user.name || user.discordUsername}
            src={user.photoUrl}
            className={classes.headerAvatar}
          />
          <ArrowDropDown className={classes.headerArrowDown} />
        </div>
      ) : (
        <Tooltip title="View profile" aria-label="View profile">
          <IconButton onClick={() => setLoginModalShown(true)}>
            <GenericGroupMemberAvatar />
          </IconButton>
        </Tooltip>
      )}
    </>
  );

  return (
    <>
      <Header
        leftComponent={<div />}
        centerComponent={centerComponent}
        rightComponent={rightComponent}
      />
      <main>
        {/* Hero unit */}
        {showWelcomeMessage && (
          <div className={classes.heroContent}>
            <Container maxWidth="md">
              <Typography
                component="h1"
                variant="h3"
                align="center"
                color="primary"
                style={{ fontWeight: 600 }}
                gutterBottom
              >
                Find your perfect reading buddies.
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="textSecondary"
                paragraph
              >
                Browse below to find others to read with. If you can't find
                anything that matches your interest, create a club so others can
                find you!
              </Typography>
              <div className={classes.heroButtons}>
                <Grid container spacing={2} justify="center">
                  {!user && (
                    <Grid item>
                      <JoinCaravanButton
                        onClick={() => setLoginModalShown(true)}
                      />
                    </Grid>
                  )}
                  {user && showWelcomeMessage && (
                    <>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => openChat()}
                        >
                          <Typography variant="button">OPEN CHAT</Typography>
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => setShowWelcomeMessage(false)}
                        >
                          <Typography variant="button">CLOSE</Typography>
                        </Button>
                      </Grid>
                    </>
                  )}
                </Grid>
              </div>
            </Container>
          </div>
        )}
        {clubsWCRResult.status === 'loaded' && (
          <ClubCards clubsWCR={clubsWCRResult.payload} user={user} />
        )}
        {clubsWCRResult.status === 'loaded' && showLoadMore && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Button
              color="primary"
              className={classes.button}
              variant="outlined"
              onClick={() =>
                setAfterQuery(
                  clubsWCRResult.payload[clubsWCRResult.payload.length - 1].club
                    ._id
                )
              }
            >
              <Typography variant="button" style={{ textAlign: 'center' }}>
                LOAD MORE...
              </Typography>
            </Button>
          </div>
        )}
      </main>
      <DiscordLoginModal
        onCloseLoginDialog={onCloseLoginModal}
        open={loginModalShown}
      />

      <Menu
        open={headerProfileMenuIsOpen}
        anchorEl={headerProfileAnchorRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={navigateToYourProfile}>Your profile</MenuItem>
        <MenuItem onClick={() => openChat()}>Open chat</MenuItem>
        <MenuItem onClick={logout}>Log out</MenuItem>
      </Menu>
    </>
  );
}
