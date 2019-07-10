import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import {
  User,
  ShelfEntry,
  Services,
  UserSelectedGenre,
  ReadingSpeed,
  Capacity,
} from '@caravan/buddy-reading-types';
import AdapterLink from '../../components/AdapterLink';
import Header from '../../components/Header';
import { washedTheme } from '../../theme';
import JoinCaravanButton from '../../components/JoinCaravanButton';
import { KEY_HIDE_WELCOME_CLUBS } from '../../common/localStorage';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import { getAllClubs } from '../../services/club';
import { Service } from '../../common/service';
import ClubCards from './ClubCards';
import logo from '../../resources/logo.svg';
import ProfileHeaderIcon from '../../components/ProfileHeaderIcon';
import ClubFilters from '../../components/filters/ClubFilters';
import { getAllGenres } from '../../services/genre';
import GenreFilterModal from '../../components/filters/GenreFilterModal';
import ReadingSpeedModal from '../../components/filters/ReadingSpeedModal';

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
    width: 48,
    height: 48,
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
  createClubIconCircle: {
    backgroundColor: washedTheme.palette.primary.main,
    marginRight: 16,
  },
  filterGrid: {
    paddingTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
  },
  filtersContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
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

  const [loginModalShown, setLoginModalShown] = React.useState(false);

  const [afterQuery, setAfterQuery] = React.useState<string | undefined>(
    undefined
  );
  const [showLoadMore, setShowLoadMore] = React.useState(false);

  const [allGenres, setAllGenres] = React.useState<Services.GetGenres | null>(
    null
  );

  const [showGenreFilter, setShowGenreFilter] = React.useState(false);

  const [showSpeedFilter, setShowSpeedFilter] = React.useState(false);

  const [showCapacityFilter, setShowCapacityFilter] = React.useState(false);

  const [filteredGenres, setFilteredGenres] = React.useState<
    UserSelectedGenre[]
  >([]);

  const [filteredSpeed, setFilteredSpeed] = React.useState<
    ReadingSpeed | 'any'
  >('any');

  const [filteredCapacity, setFilteredCapacity] = React.useState<
    Capacity | 'any'
  >('any');

  useEffect(() => {
    if (!showWelcomeMessage) {
      localStorage.setItem(KEY_HIDE_WELCOME_CLUBS, 'yes');
    }
  }, [showWelcomeMessage]);

  useEffect(() => {
    (async () => {
      const pageSize = 24;
      const res = await getAllClubs(afterQuery, pageSize);
      if (res.data) {
        const newClubsWCR = transformClubsToWithCurrentlyReading(
          res.data.clubs
        );
        setShowLoadMore(newClubsWCR.length === pageSize);
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

  useEffect(() => {
    const getGenres = async () => {
      const response = await getAllGenres();
      if (response.status >= 200 && response.status < 300) {
        const { data } = response;
        setAllGenres(data);
      }
    };
    getGenres();
  }, []);

  function onCloseLoginModal() {
    setLoginModalShown(false);
  }

  function openChat() {
    window.open(
      'https://discordapp.com/channels/592761082523680798/592761082523680806',
      '_blank'
    );
  }

  function onGenreSelected(
    genreKey: string,
    genreName: string,
    selected: boolean
  ) {
    if (selected) {
      let newGenres: UserSelectedGenre[];
      const addedGenre: UserSelectedGenre = {
        key: genreKey,
        name: genreName,
      };
      newGenres = [...filteredGenres, addedGenre];
      setFilteredGenres(newGenres);
    } else {
      const updatedGenres = filteredGenres.filter(g => g.key !== genreKey);
      setFilteredGenres(updatedGenres);
    }
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
            className={classes.createClubIconCircle}
          >
            <AddIcon />
          </IconButton>
        ) : (
          <IconButton
            edge="start"
            color="primary"
            aria-label="Add"
            onClick={() => setLoginModalShown(true)}
            className={classes.createClubIconCircle}
          >
            <AddIcon />
          </IconButton>
        )}
      </Tooltip>
      <ProfileHeaderIcon user={user} />
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
                variant="h4"
                align="center"
                color="primary"
                style={{ fontWeight: 600 }}
                gutterBottom
              >
                Read great books. Meet cool people. <br />
                Exchange big ideas.
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
        <Container className={classes.filterGrid} maxWidth="md">
          {/* <SearchByBook/> */}
          <ClubFilters
            onClickGenreFilter={() => setShowGenreFilter(true)}
            onClickSpeedFilter={() => setShowSpeedFilter(true)}
            onClickCapacityFilter={() => setShowCapacityFilter(true)}
            genreFilterApplied={filteredGenres.length > 0}
            readingSpeedFilter={filteredSpeed}
          />
          {showGenreFilter && allGenres && (
            <GenreFilterModal
              allGenres={allGenres}
              filteredGenres={filteredGenres}
              onGenreSelected={onGenreSelected}
              onClickApply={() => setShowGenreFilter(false)}
              onClickClearFilter={() => setFilteredGenres([])}
              open={showGenreFilter}
            />
          )}
          {showSpeedFilter && (
            <ReadingSpeedModal
              filteredSpeed={filteredSpeed}
              onSetSelectedSpeed={(speed: ReadingSpeed | 'any') =>
                setFilteredSpeed(speed)
              }
              onClickApply={() => setShowSpeedFilter(false)}
              onClickClearFilter={() => setFilteredSpeed('any')}
              open={showSpeedFilter}
            />
          )}
        </Container>
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
    </>
  );
}
