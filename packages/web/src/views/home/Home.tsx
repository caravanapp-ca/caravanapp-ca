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
  Services,
  ReadingSpeed,
  Capacity,
  FilterChip,
  ActiveFilter,
  FilterChipType,
  Membership,
  ClubTransformed,
  ClubWithMemberIds,
  UserWithInvitableClubs,
} from '@caravan/buddy-reading-types';
import { KEY_HIDE_WELCOME_CLUBS } from '../../common/localStorage';
import { Service } from '../../common/service';
import { washedTheme } from '../../theme';
import { getAllClubs, getUserClubs, getClubMembers } from '../../services/club';
import { getAllGenres } from '../../services/genre';
import logo from '../../resources/logo.svg';
import AdapterLink from '../../components/AdapterLink';
import Header from '../../components/Header';
import JoinCaravanButton from '../../components/JoinCaravanButton';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import ProfileHeaderIcon from '../../components/ProfileHeaderIcon';
import ClubFilters from '../../components/filters/ClubFilters';
import GenreFilterModal from '../../components/filters/GenreFilterModal';
import ReadingSpeedModal from '../../components/filters/ReadingSpeedModal';
import CapacityModal from '../../components/filters/CapacityModal';
import FilterChips from '../../components/filters/FilterChips';
import MembershipModal from '../../components/filters/MembershipModal';
import EmptyClubsFilterResult from '../../components/EmptyClubsFilterResult';
import ClubCards from './ClubCards';
import { Paper, Tabs, Tab, useMediaQuery, useTheme } from '@material-ui/core';
import { getAllUsers } from '../../services/user';
import UserCards from './UserCards';
import { getUser } from '../../services/user';
import { scheduleStrToDates } from '../../functions/scheduleStrToDates';
import clsx from 'clsx';
import shuffleArr from '../../functions/shuffleArr';

interface HomeProps extends RouteComponentProps<{}> {
  user: User | null;
  tabValuePassed?: number;
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
  tabs: {
    position: 'relative',
    zIndex: 1,
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
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
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
  },
  filtersContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  mdContainer: {
    padding: '0px 8px',
  },
}));

const transformClub = async (
  club: Services.GetClubs['clubs'][0]
): Promise<ClubTransformed> => {
  let returnObj: ClubTransformed = {
    club,
    owner: null,
    currentlyReading: null,
    schedule: null,
  };
  const owner = await getUser(club.ownerId);
  if (owner) {
    returnObj = { ...returnObj, owner };
  }
  const currentlyReading = club.shelf.find(
    book => book.readingState === 'current'
  );
  if (currentlyReading) {
    returnObj = { ...returnObj, currentlyReading };
    let schedule = club.schedules.find(
      sched => sched.shelfEntryId === currentlyReading._id
    );
    if (schedule) {
      schedule = scheduleStrToDates(schedule);
      returnObj = { ...returnObj, schedule };
    }
  }
  return returnObj;
};

export async function transformClubs(
  clubs: Services.GetClubs['clubs']
): Promise<ClubTransformed[]> {
  const clubsTransformed: ClubTransformed[] = await Promise.all(
    clubs.map(club => transformClub(club))
  );
  return clubsTransformed;
}

export async function transformUserToInvitableClub(
  users: User[],
  usersClubs: Services.GetClubs['clubs']
) {
  if (usersClubs.length === 0) {
    const usersWIC = users.map(user => {
      return { user, invitableClubs: [] };
    });
    return usersWIC;
  } else {
    const clubsWithMembers = await Promise.all(
      usersClubs.map(async function(club) {
        const res = await getClubMembers(club._id);
        if (!res.data) {
          return null;
        }
        const members = res.data;

        const memberIds = members.map(m => m._id);
        return { club, memberIds };
      })
    );
    const filteredClubsWithMembers: ClubWithMemberIds[] = clubsWithMembers.filter(
      c => c !== null
    ) as ClubWithMemberIds[];
    const usersWIC: UserWithInvitableClubs[] = users.map(user => {
      const filteredClubs = filteredClubsWithMembers.map(clubWithMembers => {
        if (!clubWithMembers.memberIds.includes(user._id)) {
          return clubWithMembers.club;
        } else {
          return null;
        }
      });
      const filteredClubsNotNull: Services.GetClubs['clubs'] = filteredClubs.filter(
        fc => fc !== null
      ) as Services.GetClubs['clubs'];

      return { user, invitableClubs: filteredClubsNotNull };
    });
    return usersWIC;
  }
}

export function shuffleUser(user: User) {
  shuffleArr(user.shelf.notStarted);
  shuffleArr(user.selectedGenres);
  shuffleArr(user.questions);
  return user;
}

export default function Home(props: HomeProps) {
  const classes = useStyles();
  const { user, tabValuePassed } = props;
  const theme = useTheme();

  const [clubsTransformedResult, setClubsTransformedResult] = React.useState<
    Service<ClubTransformed[]>
  >({ status: 'loading' });

  // const [] = React.useState<Service<ClubTransformed[]>>({
  //   status: 'loading',
  // });

  const [currentUsersClubs] = React.useState<Services.GetClubs['clubs']>([]);
  const [usersResult, setUsersResult] = React.useState<
    Service<UserWithInvitableClubs[]>
  >({ status: 'loading' });
  const [showWelcomeMessage, setShowWelcomeMessage] = React.useState(
    localStorage.getItem(KEY_HIDE_WELCOME_CLUBS) !== 'yes'
  );
  const [tabValue, setTabValue] = React.useState(
    tabValuePassed ? tabValuePassed : 0
  );
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };
  const [loginModalShown, setLoginModalShown] = React.useState(false);
  const [afterClubsQuery, setAfterClubsQuery] = React.useState<
    string | undefined
  >(undefined);
  const [showLoadMoreClubs, setShowLoadMoreClubs] = React.useState(false);
  const [showLoadMoreUsers, setShowLoadMoreUsers] = React.useState(false);
  const [allGenres, setAllGenres] = React.useState<Services.GetGenres | null>(
    null
  );
  const [showGenreFilter, setShowGenreFilter] = React.useState(false);
  const [showSpeedFilter, setShowSpeedFilter] = React.useState(false);
  const [showCapacityFilter, setShowCapacityFilter] = React.useState(false);
  const [showMembershipFilter, setShowMembershipFilter] = React.useState(false);
  const [stagingClubsFilter, setStagingClubsFilter] = React.useState<
    ActiveFilter
  >({
    genres: [],
    speed: [],
    capacity: [],
    membership: [],
  });
  const [activeClubsFilter, setActiveClubsFilter] = React.useState<
    ActiveFilter
  >({
    genres: [],
    speed: [],
    capacity: [],
    membership: [],
  });

  const [] = React.useState<ActiveFilter>({
    genres: [],
    speed: [],
    capacity: [],
    membership: [],
  });
  const [activeUsersFilter] = React.useState<ActiveFilter>({
    genres: [],
    speed: [],
    capacity: [],
    membership: [],
  });
  const [afterUsersQuery, setAfterUsersQuery] = React.useState<
    string | undefined
  >(undefined);

  const clubGenreFiltersApplied = activeClubsFilter.genres.length > 0;
  const clubSpeedFiltersApplied = activeClubsFilter.speed.length > 0;
  const clubCapacityFiltersApplied = activeClubsFilter.capacity.length > 0;
  const clubMembershipFiltersApplied = activeClubsFilter.membership.length > 0;
  const clubFiltersApplied =
    clubGenreFiltersApplied ||
    clubSpeedFiltersApplied ||
    clubCapacityFiltersApplied ||
    clubMembershipFiltersApplied;

  const screenSmallerThanMd = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!showWelcomeMessage) {
      localStorage.setItem(KEY_HIDE_WELCOME_CLUBS, 'yes');
    }
  }, [showWelcomeMessage]);

  useEffect(() => {
    const pageSize = 24;
    if (clubFiltersApplied) {
      // Get clubs filtered
      (async () => {
        // TODO: right now this is typed as any because the response returned could be of variable type
        let res: any;
        if (user && clubMembershipFiltersApplied) {
          res = await getUserClubs(
            user._id,
            afterClubsQuery,
            pageSize,
            activeClubsFilter
          );
        } else {
          res = await getAllClubs(afterClubsQuery, pageSize, activeClubsFilter);
        }
        if (res.data) {
          const newClubsTransformed = await transformClubs(res.data.clubs);
          setShowLoadMoreClubs(newClubsTransformed.length === pageSize);
          setClubsTransformedResult(s => ({
            status: 'loaded',
            payload:
              s.status === 'loaded'
                ? [...s.payload, ...newClubsTransformed]
                : newClubsTransformed,
          }));
        }
      })();
    } else {
      // Normal get all clubs
      (async () => {
        const res = await getAllClubs(afterClubsQuery, pageSize);
        if (res.data) {
          const newClubsTransformed = await transformClubs(res.data.clubs);
          setShowLoadMoreClubs(newClubsTransformed.length === pageSize);
          setClubsTransformedResult(s => ({
            status: 'loaded',
            payload:
              s.status === 'loaded'
                ? [...s.payload, ...newClubsTransformed]
                : newClubsTransformed,
          }));
        }
      })();
    }
  }, [activeClubsFilter, afterClubsQuery]);

  useEffect(() => {
    const pageSize = 24;
    (async () => {
      const res = await getAllUsers(afterUsersQuery, pageSize);

      if (res.data) {
        let usersClubs: Services.GetClubs['clubs'] = [];
        // if (user) {
        //   const userClubsRes = await getUserClubs(
        //     user._id,
        //     undefined,
        //     pageSize,
        //     {
        //       genres: [],
        //       speed: [],
        //       capacity: [],
        //       membership: [
        //         { key: 'spotsAvailable', name: 'Available', type: 'capacity' },
        //       ],
        //     }
        //   );
        //   if (userClubsRes.data) {
        //     usersClubs = userClubsRes.data.clubs;
        //   }
        // }
        const newUsers = res.data.users;
        const newUsersShuffled = newUsers.map(user => shuffleUser(user));
        const newUsersWithInvitableClubs = await transformUserToInvitableClub(
          newUsersShuffled,
          usersClubs
        );
        setShowLoadMoreUsers(newUsersWithInvitableClubs.length === pageSize);
        setUsersResult(s => ({
          status: 'loaded',
          payload:
            s.status === 'loaded'
              ? [...s.payload, ...newUsersWithInvitableClubs]
              : newUsersWithInvitableClubs,
        }));
      }
    })();
  }, [activeUsersFilter, afterUsersQuery]);

  // Get genres on mount
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

  function onClickMembershipFilter() {
    if (user) {
      setShowMembershipFilter(true);
    } else {
      setLoginModalShown(true);
    }
  }

  function onGenreSelected(
    genreKey: string,
    genreName: string,
    selected: boolean
  ) {
    if (selected) {
      const addedGenre: FilterChip = {
        key: genreKey,
        name: genreName,
        type: 'genres',
      };
      let newGenres = [...stagingClubsFilter.genres, addedGenre];
      setStagingClubsFilter({ ...stagingClubsFilter, genres: newGenres });
    } else {
      const updatedGenres = stagingClubsFilter.genres.filter(
        g => g.key !== genreKey
      );
      setStagingClubsFilter({ ...stagingClubsFilter, genres: updatedGenres });
    }
  }

  async function saveGenreSelection() {
    let genreFiltersChanged = false;
    if (activeClubsFilter.genres.length !== stagingClubsFilter.genres.length) {
      genreFiltersChanged = true;
    } else {
      if (
        JSON.stringify(activeClubsFilter) !== JSON.stringify(stagingClubsFilter)
      ) {
        genreFiltersChanged = true;
      }
    }
    if (genreFiltersChanged) {
      await resetFilters();
      setActiveClubsFilter({
        ...activeClubsFilter,
        genres: stagingClubsFilter.genres,
      });
    }
    setShowGenreFilter(false);
  }

  async function saveSpeedSelection() {
    let speedFiltersChanged = false;
    if (activeClubsFilter.speed.length !== stagingClubsFilter.speed.length) {
      speedFiltersChanged = true;
    } else if (
      activeClubsFilter.speed.length > 0 &&
      stagingClubsFilter.speed.length > 0
    ) {
      if (activeClubsFilter.speed[0].key !== stagingClubsFilter.speed[0].key) {
        speedFiltersChanged = true;
      }
    }
    if (speedFiltersChanged) {
      await resetFilters();
      setActiveClubsFilter({
        ...activeClubsFilter,
        speed: stagingClubsFilter.speed,
      });
    }
    setShowSpeedFilter(false);
  }

  async function saveCapacitySelection() {
    let capacityFiltersChanged = false;
    if (
      activeClubsFilter.capacity.length !== stagingClubsFilter.capacity.length
    ) {
      capacityFiltersChanged = true;
    } else if (
      activeClubsFilter.capacity.length > 0 &&
      stagingClubsFilter.capacity.length > 0 &&
      activeClubsFilter.capacity[0].key !== stagingClubsFilter.capacity[0].key
    ) {
      capacityFiltersChanged = true;
    }
    if (capacityFiltersChanged) {
      await resetFilters();
      setActiveClubsFilter({
        ...activeClubsFilter,
        capacity: stagingClubsFilter.capacity,
      });
    }
    setShowCapacityFilter(false);
  }

  async function saveMembershipSelection() {
    let membershipFiltersChanged = false;
    if (
      activeClubsFilter.membership.length !==
      stagingClubsFilter.membership.length
    ) {
      membershipFiltersChanged = true;
    } else if (
      activeClubsFilter.membership.length > 0 &&
      stagingClubsFilter.membership.length > 0 &&
      activeClubsFilter.membership[0].key !==
        stagingClubsFilter.membership[0].key
    ) {
      membershipFiltersChanged = true;
    }
    if (membershipFiltersChanged) {
      await resetFilters();
      setActiveClubsFilter({
        ...activeClubsFilter,
        membership: stagingClubsFilter.membership,
      });
    }
    setShowMembershipFilter(false);
  }

  async function removeFilterChip(key: string, type: FilterChipType) {
    await resetFilters();
    if (type === 'speed') {
      setActiveClubsFilter({ ...activeClubsFilter, speed: [] });
      setStagingClubsFilter({ ...stagingClubsFilter, speed: [] });
    } else if (type === 'genres') {
      const updatedGenres = activeClubsFilter.genres.filter(c => c.key !== key);
      setActiveClubsFilter({ ...activeClubsFilter, genres: updatedGenres });
      setStagingClubsFilter({ ...stagingClubsFilter, genres: updatedGenres });
    } else if (type === 'capacity') {
      setActiveClubsFilter({ ...activeClubsFilter, capacity: [] });
      setStagingClubsFilter({ ...stagingClubsFilter, capacity: [] });
    } else if (type === 'membership') {
      setStagingClubsFilter({ ...stagingClubsFilter, membership: [] });
      setActiveClubsFilter({ ...activeClubsFilter, membership: [] });
    }
  }

  const resetFilters = async () => {
    await setClubsTransformedResult(s => ({
      ...s,
      status: 'loading',
    }));
    await setAfterClubsQuery(undefined);
  };

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
            <Container maxWidth="md" className={classes.mdContainer}>
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
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant={screenSmallerThanMd ? 'fullWidth' : undefined}
          centered={!screenSmallerThanMd}
        >
          <Tab label="Clubs" />
          <Tab label="People" />
        </Tabs>
        {tabValue === 0 && (
          <>
            <Container
              className={clsx(classes.filterGrid, classes.mdContainer)}
              maxWidth="md"
            >
              <ClubFilters
                onClickGenreFilter={() => setShowGenreFilter(true)}
                onClickSpeedFilter={() => setShowSpeedFilter(true)}
                onClickCapacityFilter={() => setShowCapacityFilter(true)}
                onClickMembershipFilter={onClickMembershipFilter}
                genreFilterApplied={clubGenreFiltersApplied}
                readingSpeedFilterApplied={clubSpeedFiltersApplied}
                capacityFilterApplied={clubCapacityFiltersApplied}
                memberFilterApplied={clubMembershipFiltersApplied}
              />
              {clubFiltersApplied && (
                <div className={classes.filtersContainer}>
                  {activeClubsFilter.genres.map(genre => (
                    <FilterChips
                      key={genre.key}
                      chipKey={genre.key}
                      name={genre.name}
                      type={'genres'}
                      active={true}
                      onRemove={removeFilterChip}
                    />
                  ))}
                  {activeClubsFilter.speed.map(speed => (
                    <FilterChips
                      key={speed.key}
                      chipKey={speed.key}
                      name={speed.name}
                      type={'speed'}
                      active={true}
                      onRemove={removeFilterChip}
                    />
                  ))}
                  {activeClubsFilter.capacity.map(capacity => (
                    <FilterChips
                      key={capacity.key}
                      chipKey={capacity.key}
                      name={capacity.name}
                      type={'capacity'}
                      active={true}
                      onRemove={removeFilterChip}
                    />
                  ))}
                  {activeClubsFilter.membership.map(membership => (
                    <FilterChips
                      key={membership.key}
                      chipKey={membership.key}
                      name={membership.name}
                      type={'membership'}
                      active={true}
                      onRemove={removeFilterChip}
                    />
                  ))}
                </div>
              )}
            </Container>
            {clubsTransformedResult.status === 'loaded' &&
              clubsTransformedResult.payload.length > 0 && (
                <ClubCards
                  clubsTransformed={clubsTransformedResult.payload}
                  user={user}
                />
              )}
            {clubsTransformedResult.status === 'loaded' && showLoadMoreClubs && (
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
                    setAfterClubsQuery(
                      clubsTransformedResult.payload[
                        clubsTransformedResult.payload.length - 1
                      ].club._id
                    )
                  }
                />
              </div>
            )}
            <GenreFilterModal
              allGenres={allGenres}
              filteredGenres={stagingClubsFilter.genres}
              onGenreSelected={onGenreSelected}
              onClickApply={saveGenreSelection}
              onClickClearFilter={() =>
                setStagingClubsFilter({ ...stagingClubsFilter, genres: [] })
              }
              open={!!(allGenres && showGenreFilter)}
            />
            <ReadingSpeedModal
              filteredSpeed={stagingClubsFilter.speed}
              onSetSelectedSpeed={(speed: ReadingSpeed, label: string) =>
                setStagingClubsFilter({
                  ...stagingClubsFilter,
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
                setStagingClubsFilter({
                  ...stagingClubsFilter,
                  speed: [],
                })
              }
              open={showSpeedFilter}
            />
            <CapacityModal
              filteredCapacities={stagingClubsFilter.capacity}
              onClickApply={saveCapacitySelection}
              onClickClearFilter={() =>
                setStagingClubsFilter({ ...stagingClubsFilter, capacity: [] })
              }
              onCapacitySelected={(capacity: Capacity, label: string) =>
                setStagingClubsFilter({
                  ...stagingClubsFilter,
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
            <MembershipModal
              filteredMemberships={stagingClubsFilter.membership}
              onClickApply={saveMembershipSelection}
              onClickClearFilter={() =>
                setStagingClubsFilter({
                  ...stagingClubsFilter,
                  membership: [],
                })
              }
              onMembershipSelected={(membership: Membership, label: string) =>
                setStagingClubsFilter({
                  ...stagingClubsFilter,
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
          </>
        )}
        {tabValue === 1 && (
          <>
            {usersResult.status === 'loaded' &&
              usersResult.payload.length > 0 && (
                <UserCards
                  usersWithInvitableClubs={usersResult.payload}
                  user={user}
                  userClubs={currentUsersClubs}
                />
              )}
            {usersResult.status === 'loaded' && showLoadMoreUsers && (
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
                    setAfterUsersQuery(
                      usersResult.payload[usersResult.payload.length - 1].user
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
          </>
        )}
      </main>
      <DiscordLoginModal
        onCloseLoginDialog={onCloseLoginModal}
        open={loginModalShown}
      />
    </>
  );
}
