import React, { useEffect } from 'react';
import { User, ShelfEntry, Services } from '@caravan/buddy-reading-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import AdapterLink from '../../components/AdapterLink';
import Header from '../../components/Header';
import JoinCaravanButton from '../../components/JoinCaravanButton';
import { KEY_HIDE_WELCOME_CLUBS } from '../../common/localStorage';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import { getAllClubs } from '../../services/club';
import ClubCards from './ClubCards';
import logo from '../../resources/logo.svg';

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

export default function Home(props: HomeProps) {
  const classes = useStyles();
  const [clubsWCR, setClubsWCR] = React.useState<ClubWithCurrentlyReading[]>(
    []
  );
  const [showWelcomeMessage, setShowWelcomeMessage] = React.useState(
    localStorage.getItem(KEY_HIDE_WELCOME_CLUBS) !== 'yes'
  );
  useEffect(() => {
    if (!showWelcomeMessage) {
      localStorage.setItem(KEY_HIDE_WELCOME_CLUBS, 'yes');
    }
  }, [showWelcomeMessage]);

  const [loginModalShown, setLoginModalShown] = React.useState(false);

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

  const centerComponent = (
    <img src={logo} style={{ height: 20, objectFit: 'contain' }} />
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
                  {!props.user && (
                    <Grid item>
                      <JoinCaravanButton
                        onClick={() => setLoginModalShown(true)}
                      />
                    </Grid>
                  )}
                  {props.user && showWelcomeMessage && (
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setShowWelcomeMessage(false)}
                      >
                        <Typography variant="button">CLOSE</Typography>
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </div>
            </Container>
          </div>
        )}
        <ClubCards clubsWCR={clubsWCR} user={props.user} />
      </main>
      <DiscordLoginModal
        onCloseLoginDialog={onCloseLoginModal}
        open={loginModalShown}
      />
    </>
  );
}
