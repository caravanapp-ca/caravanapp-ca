import React, { useEffect } from 'react';
import qs from 'query-string';
import { User, Club, ShelfEntry, Services } from '@caravan/buddy-reading-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';
import AdapterLink from '../../components/AdapterLink';
import Header from '../../components/Header';
import { deleteCookie } from '../../common/cookies';
import { DISCORD_OAUTH_STATE } from '../../state';
import DiscordAuthButton from '../../components/DiscordAuthButton';
import ClubCards from './ClubCards';
import { UserCard } from './UserCard';
import { getAllClubs } from '../../services/club';
import DiscordLoginModal from '../../components/DiscordLoginModal';

interface HomeProps {
  user: User | null;
}

export interface ClubWithCurrentlyReading {
  club: Services.GetClubs['clubs'][0];
  currentlyReading: ShelfEntry | null;
}

const useStyles = makeStyles(theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(0, 0, 6),
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

export default function Home(props: HomeProps) {
  const classes = useStyles();
  const [clubsWCR, setClubsWCR] = React.useState<ClubWithCurrentlyReading[]>(
    []
  );
  const welcomeKey = 'hide-clubs-welcome';
  const [showWelcomeMessage, setShowWelcomeMessage] = React.useState(
    localStorage.getItem(welcomeKey) !== 'yes'
  );
  useEffect(() => {
    if (!showWelcomeMessage) {
      localStorage.setItem(welcomeKey, 'yes');
    }
  }, [showWelcomeMessage]);

  const [loginModalShown, setLoginModalShown] = React.useState(false);

  // Handle the `state` query to verify login
  useEffect(() => {
    const queries = qs.parse(window.location.search);
    if (queries && queries.state) {
      // Someone tampered with the login, remove token
      if (queries.state !== localStorage.getItem(DISCORD_OAUTH_STATE)) {
        deleteCookie('token');
      }
      localStorage.removeItem(DISCORD_OAUTH_STATE);
    }
  }, []);

  useEffect(() => {
    const getClubs = async () => {
      const responseData = await getAllClubs();
      if (responseData) {
        const clubsWCR = transformClubsToWithCurrentlyReading(
          responseData.clubs
        );
        setClubsWCR(clubsWCR);
      }
    };
    getClubs();
  }, []);

  function transformClubsToWithCurrentlyReading(
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

  function onCloseLoginModal() {
    setLoginModalShown(false);
  }

  const leftComponent = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="Home"
      component={AdapterLink}
      to="/"
    >
      <HomeIcon />
    </IconButton>
  );

  const centerComponent = (
    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
      Find Groups
    </Typography>
  );

  const rightComponent = props.user ? (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="Add"
      component={AdapterLink}
      to="/clubs/create"
    >
      <AddIcon />
    </IconButton>
  ) : (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="Add"
      onClick={() => setLoginModalShown(true)}
    >
      <AddIcon />
    </IconButton>
  );

  return (
    <>
      <CssBaseline />
      <Header
        leftComponent={leftComponent}
        centerComponent={centerComponent}
        rightComponent={rightComponent}
      />
      <main>
        {/* Hero unit */}
        {showWelcomeMessage && (
          <div className={classes.heroContent}>
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="textPrimary"
                gutterBottom
                style={{ marginTop: 20 }}
              >
                Welcome to Caravan!
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="textSecondary"
                paragraph
              >
                Scroll around below to see any buddies or groups that are
                available to read with. If you can't find anything quite right,
                create a group yourself so people can find you!
              </Typography>
              <div className={classes.heroButtons}>
                <Grid container spacing={2} justify="center">
                  {!props.user && (
                    <Grid item>
                      <DiscordAuthButton />
                    </Grid>
                  )}
                  {props.user && showWelcomeMessage && (
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setShowWelcomeMessage(false)}
                      >
                        Close
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </div>
            </Container>
          </div>
        )}
        <ClubCards clubsWCR={clubsWCR} user={props.user} />
        {!props.user && (
          <div className={classes.bottomAuthButton}>
            <UserCard user={props.user} />
          </div>
        )}
      </main>
      {loginModalShown && (
        <DiscordLoginModal onCloseLoginModal={onCloseLoginModal} />
      )}
    </>
  );
}
