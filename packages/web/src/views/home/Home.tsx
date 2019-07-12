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
  FilterChip,
  ActiveFilter,
  FilterChipType,
  Membership,
} from '@caravan/buddy-reading-types';
import AdapterLink from '../../components/AdapterLink';
import Header from '../../components/Header';
import { washedTheme } from '../../theme';
import JoinCaravanButton from '../../components/JoinCaravanButton';
import { KEY_HIDE_WELCOME_CLUBS } from '../../common/localStorage';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import { getAllClubs, getUserClubs } from '../../services/club';
import { Service } from '../../common/service';
import ClubCards from './ClubCards';
import logo from '../../resources/logo.svg';
import ProfileHeaderIcon from '../../components/ProfileHeaderIcon';
import ClubFilters from '../../components/filters/ClubFilters';
import { getAllGenres } from '../../services/genre';
import GenreFilterModal from '../../components/filters/GenreFilterModal';
import ReadingSpeedModal from '../../components/filters/ReadingSpeedModal';
import CapacityModal from '../../components/filters/CapacityModal';
import FilterChips from '../../components/filters/FilterChips';
import { capacityLabels } from '../../components/capacity-labels';
import MembershipModal from '../../components/filters/MembershipModal';
import EmptyClubsFilterResult from '../../components/EmptyClubsFilterResult';

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
    paddingTop: theme.spacing(4),
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
  console.log('Clubs in transform method');
  console.log(clubs);
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

  const [filteredClubsWCRResult, setFilteredClubsWCRResult] = React.useState<
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
  const [showLoadMoreFiltered, setShowLoadMoreFiltered] = React.useState(false);

  const [allGenres, setAllGenres] = React.useState<Services.GetGenres | null>(
    null
  );

  const [showGenreFilter, setShowGenreFilter] = React.useState(false);

  const [showSpeedFilter, setShowSpeedFilter] = React.useState(false);

  const [showCapacityFilter, setShowCapacityFilter] = React.useState(false);

  const [showMembershipFilter, setShowMembershipFilter] = React.useState(false);

  const [stagingFilter, setStagingFilter] = React.useState<ActiveFilter>({
    genres: [],
    speed: [],
    capacity: [],
    membership: [],
  });

  const [activeFilter, setActiveFilter] = React.useState<ActiveFilter>({
    genres: [],
    speed: [],
    capacity: [],
    membership: [],
  });

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

  useEffect(() => {
    (async () => {
      // Should be 24
      const pageSize = 3;
      if (
        activeFilter.genres.length +
          activeFilter.capacity.length +
          activeFilter.speed.length +
          activeFilter.membership.length >
        0
      ) {
        // TODO right now this is typed as any because the response returned could be of variable type
        var res: any;
        if (
          user &&
          activeFilter.membership.length > 0 &&
          activeFilter.membership[0].key === 'myClubs'
        ) {
          res = await getUserClubs(
            user._id,
            afterQuery,
            pageSize,
            activeFilter
          );
        } else {
          res = await getAllClubs(afterQuery, pageSize, activeFilter);
        }
        if (res.data) {
          console.log('Res in use effect');
          console.log(res);
          const newFilteredClubsWCR = transformClubsToWithCurrentlyReading(
            res.data.clubs
          );
          console.log('Clubs in use effect after transform');
          console.log(newFilteredClubsWCR);
          setFilteredClubsWCRResult(s => ({
            status: 'loaded',
            payload:
              s.status === 'loaded' && showLoadMoreFiltered
                ? [...s.payload, ...newFilteredClubsWCR]
                : newFilteredClubsWCR,
          }));
          setShowLoadMoreFiltered(newFilteredClubsWCR.length === pageSize);
        }
      } else {
        if (filteredClubsWCRResult.status === 'loaded') {
          setShowLoadMoreFiltered(
            filteredClubsWCRResult.payload.length === pageSize
          );
        }
      }
    })();
  }, [activeFilter, afterQuery]);

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
      let newGenres: FilterChip[];
      const addedGenre: FilterChip = {
        key: genreKey,
        name: genreName,
        type: 'genres',
      };
      newGenres = [...stagingFilter.genres, addedGenre];
      setStagingFilter({ ...stagingFilter, genres: newGenres });
    } else {
      const updatedGenres = stagingFilter.genres.filter(
        g => g.key !== genreKey
      );
      setStagingFilter({ ...stagingFilter, genres: updatedGenres });
    }
  }

  function saveGenreSelection() {
    if (activeFilter.genres.length !== stagingFilter.genres.length) {
      setActiveFilter({ ...activeFilter, genres: stagingFilter.genres });
    } else {
      var stagingGenreKeys = stagingFilter.genres
        .map((sc: { key: any }) => sc.key)
        .sort();
      var activeGenreKeys = activeFilter.genres
        .map((ac: { key: any }) => ac.key)
        .sort();
      if (activeGenreKeys !== stagingGenreKeys) {
        setActiveFilter({ ...activeFilter, genres: stagingFilter.genres });
      }
    }
    setShowGenreFilter(false);
  }

  // Not needed until capacity  becomes of type checkbox (ie >1 options allowed per time)
  // function onCapacitySelected(
  //   capacity: Capacity,
  //   label: string,
  //   selected: boolean
  // ) {
  //   if (selected) {
  //     let newCapacities: FilterChip[];
  //     const addedCapacity: FilterChip = {
  //       key: capacity,
  //       name: label,
  //       type: 'capacity',
  //     };
  //     newCapacities = [...stagingFilter.capacity, addedCapacity];
  //     setStagingFilter({ ...stagingFilter, capacity: newCapacities });
  //   } else {
  //     const updatedCapacity = stagingFilter.capacity.filter(
  //       c => c.key !== capacity
  //     );
  //     setStagingFilter({ ...stagingFilter, capacity: updatedCapacity });
  //   }
  // }

  function saveSpeedSelection() {
    if (activeFilter.speed.length !== stagingFilter.speed.length) {
      setActiveFilter({ ...activeFilter, speed: stagingFilter.speed });
    } else if (
      activeFilter.speed.length > 0 &&
      stagingFilter.speed.length > 0
    ) {
      if (activeFilter.speed[0].key !== stagingFilter.speed[0].key) {
        setActiveFilter({ ...activeFilter, speed: stagingFilter.speed });
      }
    }
    setShowSpeedFilter(false);
  }

  function saveCapacitySelection() {
    if (activeFilter.capacity.length !== stagingFilter.capacity.length) {
      setActiveFilter({ ...activeFilter, capacity: stagingFilter.capacity });
    } else if (
      activeFilter.capacity.length > 0 &&
      stagingFilter.capacity.length > 0
    ) {
      if (activeFilter.capacity[0].key !== stagingFilter.capacity[0].key) {
        setActiveFilter({ ...activeFilter, capacity: stagingFilter.capacity });
      }
    }
    setShowCapacityFilter(false);
  }

  function saveMembershipSelection() {
    if (
      activeFilter.membership.length !== stagingFilter.membership.length ||
      activeFilter.membership[0].key !== stagingFilter.membership[0].key
    ) {
      setActiveFilter({
        ...activeFilter,
        membership: stagingFilter.membership,
      });
    }
    setShowMembershipFilter(false);
  }

  function removeFilterChip(key: string, type: FilterChipType) {
    if (type === 'speed') {
      setActiveFilter({ ...activeFilter, speed: [] });
      setStagingFilter({ ...stagingFilter, speed: [] });
    } else if (type === 'genres') {
      const updatedGenres = activeFilter.genres.filter(c => c.key !== key);
      setActiveFilter({ ...activeFilter, genres: updatedGenres });
      setStagingFilter({ ...stagingFilter, genres: updatedGenres });
    } else if (type === 'capacity') {
      setActiveFilter({ ...activeFilter, capacity: [] });
      setStagingFilter({ ...stagingFilter, capacity: [] });
    } else if (type === 'membership') {
      setStagingFilter({ ...stagingFilter, membership: [] });
      setActiveFilter({ ...activeFilter, membership: [] });
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
            onClickMembershipFilter={() => setShowMembershipFilter(true)}
            genreFilterApplied={activeFilter.genres.length > 0}
            readingSpeedFilterApplied={activeFilter.speed.length > 0}
            capacityFilterApplied={activeFilter.capacity.length > 0}
            memberFilterApplied={activeFilter.membership.length > 0}
          />
          {activeFilter.genres.length +
            activeFilter.capacity.length +
            activeFilter.speed.length +
            activeFilter.membership.length >
            0 && (
            <div>
              {activeFilter.genres.map(genre => (
                <FilterChips
                  chipKey={genre.key}
                  name={genre.name}
                  type={'genres'}
                  active={true}
                  onRemove={removeFilterChip}
                />
              ))}
              {activeFilter.speed.map(speed => (
                <FilterChips
                  chipKey={speed.key}
                  name={speed.name}
                  type={'speed'}
                  active={true}
                  onRemove={removeFilterChip}
                />
              ))}
              {activeFilter.capacity.map(capacity => (
                <FilterChips
                  chipKey={capacity.key}
                  name={capacity.name}
                  type={'capacity'}
                  active={true}
                  onRemove={removeFilterChip}
                />
              ))}
              {activeFilter.membership.map(membership => (
                <FilterChips
                  chipKey={membership.key}
                  name={membership.name}
                  type={'membership'}
                  active={true}
                  onRemove={removeFilterChip}
                />
              ))}
            </div>
          )}
          {showGenreFilter && allGenres && (
            <GenreFilterModal
              allGenres={allGenres}
              filteredGenres={stagingFilter.genres}
              onGenreSelected={onGenreSelected}
              onClickApply={saveGenreSelection}
              onClickClearFilter={() =>
                setStagingFilter({ ...stagingFilter, genres: [] })
              }
              open={showGenreFilter}
            />
          )}
          {showSpeedFilter && (
            <ReadingSpeedModal
              filteredSpeed={stagingFilter.speed}
              onSetSelectedSpeed={(speed: ReadingSpeed, label: string) =>
                setStagingFilter({
                  ...stagingFilter,
                  speed: [
                    {
                      name: label,
                      key: speed,
                      type: 'speed',
                    },
                  ],
                })
              }
              onClickApply={saveSpeedSelection}
              onClickClearFilter={() =>
                setStagingFilter({
                  ...stagingFilter,
                  speed: [],
                })
              }
              open={showSpeedFilter}
            />
          )}
          {showCapacityFilter && (
            <CapacityModal
              filteredCapacities={stagingFilter.capacity}
              onClickApply={saveCapacitySelection}
              onClickClearFilter={() =>
                setStagingFilter({ ...stagingFilter, capacity: [] })
              }
              onCapacitySelected={(capacity: Capacity, label: string) =>
                setStagingFilter({
                  ...stagingFilter,
                  capacity: [
                    {
                      name: label,
                      key: capacity,
                      type: 'capacity',
                    },
                  ],
                })
              }
              open={showCapacityFilter}
            />
          )}
          {showMembershipFilter && (
            <MembershipModal
              filteredMemberships={stagingFilter.membership}
              onClickApply={saveMembershipSelection}
              onClickClearFilter={() =>
                setStagingFilter({ ...stagingFilter, membership: [] })
              }
              onMembershipSelected={(membership: Membership, label: string) =>
                setStagingFilter({
                  ...stagingFilter,
                  membership: [
                    {
                      name: label,
                      key: membership,
                      type: 'membership',
                    },
                  ],
                })
              }
              open={showMembershipFilter}
            />
          )}
        </Container>
        {clubsWCRResult.status === 'loaded' &&
          activeFilter.genres.length +
            activeFilter.capacity.length +
            activeFilter.speed.length +
            activeFilter.membership.length <=
            0 && <ClubCards clubsWCR={clubsWCRResult.payload} user={user} />}
        {filteredClubsWCRResult.status === 'loaded' &&
          activeFilter.genres.length +
            activeFilter.capacity.length +
            activeFilter.speed.length +
            activeFilter.membership.length >
            0 &&
          filteredClubsWCRResult.payload.length > 0 && (
            <ClubCards clubsWCR={filteredClubsWCRResult.payload} user={user} />
          )}
        {filteredClubsWCRResult.status === 'loaded' &&
          activeFilter.genres.length +
            activeFilter.capacity.length +
            activeFilter.speed.length +
            activeFilter.membership.length >
            0 &&
          filteredClubsWCRResult.payload.length === 0 && (
            <EmptyClubsFilterResult />
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
        {filteredClubsWCRResult.status === 'loaded' && showLoadMoreFiltered && (
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
                  filteredClubsWCRResult.payload[
                    filteredClubsWCRResult.payload.length - 1
                  ].club._id
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
