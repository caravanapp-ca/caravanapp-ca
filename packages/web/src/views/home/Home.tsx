import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Element, scroller } from 'react-scroll';
import Button from '@material-ui/core/Button';
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
import { getAllClubs, getUserClubsWithMembers } from '../../services/club';
import { getAllGenres } from '../../services/genre';
import logo from '../../resources/logo.svg';
import textLogo from '../../resources/text-logo.svg';
import AdapterLink from '../../components/AdapterLink';
import Header from '../../components/Header';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import ProfileHeaderIcon from '../../components/ProfileHeaderIcon';
import ClubFilters from '../../components/filters/ClubFilters';
import GenreFilterModal from '../../components/filters/GenreFilterModal';
import ReadingSpeedModal from '../../components/filters/ReadingSpeedModal';
import CapacityModal from '../../components/filters/CapacityModal';
import FilterChips from '../../components/filters/FilterChips';
import MembershipModal from '../../components/filters/MembershipModal';
import ClubCards from './ClubCards';
import {
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from '@material-ui/core';
import { getAllUsers } from '../../services/user';
import UserCards from './UserCards';
import { transformClub } from '../club/functions/ClubFunctions';
import shuffleArr from '../../functions/shuffleArr';
import FilterSearch from '../../components/filters/FilterSearch';
import Splash from './Splash';
import ShareIconButton from '../../components/ShareIconButton';
import CustomSnackbar, {
  CustomSnackbarProps,
} from '../../components/CustomSnackbar';

interface HomeProps extends RouteComponentProps<{}> {
  user: User | null;
  userLoaded: boolean;
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
    //For some reason the "create club" icon button had marginLeft = -12
    marginLeft: 0,
  },
  filterGrid: {
    marginTop: '16px',
    padding: '0px 16px',
    display: 'flex',
    flexDirection: 'column',
  },
  filtersContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
}));

const defaultActiveFilter: ActiveFilter = {
  genres: [],
  speed: [],
  capacity: [],
  membership: [],
};

function transformUserToInvitableClub(
  allUsers: User[],
  currUsersClubWMembers: ClubWithMemberIds[]
) {
  if (currUsersClubWMembers.length === 0) {
    const usersWIC = allUsers.map(user => {
      return { user, invitableClubs: [] };
    });
    return usersWIC;
  } else {
    const usersWIC: UserWithInvitableClubs[] = allUsers.map(user => {
      const filteredClubs = currUsersClubWMembers.filter(
        cWM => !cWM.memberIds.includes(user._id)
      );
      return { user, invitableClubs: filteredClubs };
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
  const { user, userLoaded } = props;
  const theme = useTheme();

  const [clubsTransformedResult, setClubsTransformedResult] = React.useState<
    Service<ClubTransformed[]>
  >({ status: 'loading' });
  const [usersResult, setUsersResult] = React.useState<
    Service<UserWithInvitableClubs[]>
  >({ status: 'loading' });
  const [loadingMoreUsers, setLoadingMoreUsers] = React.useState<boolean>(
    false
  );
  const [loadingMoreClubs, setLoadingMoreClubs] = React.useState<boolean>(
    false
  );
  const [showWelcomeMessage, setShowWelcomeMessage] = React.useState(
    localStorage.getItem(KEY_HIDE_WELCOME_CLUBS) !== 'yes'
  );
  const [tabValue, setTabValue] = React.useState(0);
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
  >(defaultActiveFilter);
  const [activeClubsFilter, setActiveClubsFilter] = React.useState<
    ActiveFilter
  >(defaultActiveFilter);
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
  const [search, setSearch] = React.useState<string>('');

  const screenSmallerThanMd = useMediaQuery(theme.breakpoints.down('sm'));
  const screenSmallerThanSm = useMediaQuery(theme.breakpoints.down('xs'));

  const [snackbarProps, setSnackbarProps] = React.useState<CustomSnackbarProps>(
    {
      autoHideDuration: 6000,
      isOpen: false,
      handleClose: onSnackbarClose,
      variant: 'success',
    }
  );

  useEffect(() => {
    if (!showWelcomeMessage) {
      localStorage.setItem(KEY_HIDE_WELCOME_CLUBS, 'yes');
    }
  }, [showWelcomeMessage]);

  useEffect(() => {
    if (!userLoaded) {
      return;
    }
    // Implementing request canceling
    let didCancel = false;
    const pageSize = 24;
    setLoadingMoreClubs(true);
    const userId = user && clubMembershipFiltersApplied ? user._id : undefined;
    (async () => {
      const res = await getAllClubs(
        userId,
        afterClubsQuery,
        pageSize,
        activeClubsFilter,
        search
      );
      const clubs = res.data
        ? res.data.clubs.map(c => transformClub(c))
        : undefined;
      // Ignore if we started fetching something else
      if (clubs && !didCancel) {
        setShowLoadMoreClubs(clubs.length === pageSize);
        setClubsTransformedResult(s => ({
          status: 'loaded',
          payload: s.status === 'loaded' ? [...s.payload, ...clubs] : clubs,
        }));
        setLoadingMoreClubs(false);
      }
    })();
    // Remember if we start fetching something else.
    return () => {
      didCancel = true;
    };
  }, [
    user,
    userLoaded,
    activeClubsFilter,
    clubMembershipFiltersApplied,
    afterClubsQuery,
    search,
  ]);

  useEffect(() => {
    if (!userLoaded) {
      return;
    }
    const pageSize = 12;
    (async () => {
      const res = await getAllUsers(afterUsersQuery, 1, pageSize);
      if (res.status === 200) {
        let currUserClubsWithMembers: ClubWithMemberIds[] = [];
        if (user) {
          const currUserClubsRes = await getUserClubsWithMembers(
            user._id,
            undefined,
            pageSize,
            {
              genres: [],
              speed: [],
              capacity: [
                { key: 'spotsAvailable', name: 'Available', type: 'capacity' },
              ],
              membership: [
                { key: 'myClubs', name: 'My clubs', type: 'membership' },
              ],
            }
          );
          if (currUserClubsRes.status === 200) {
            currUserClubsWithMembers = currUserClubsRes.data.map(c => {
              const memberIds = c.members.map(m => m._id);
              return { club: c, memberIds };
            });
          }
        }
        const allUsers = res.data.users;
        const allUsersShuffled = allUsers.map(user => shuffleUser(user));
        const allUsersWithInvitableClubs = transformUserToInvitableClub(
          allUsersShuffled,
          currUserClubsWithMembers
        );
        setShowLoadMoreUsers(allUsersWithInvitableClubs.length === pageSize);
        setUsersResult(s => ({
          status: 'loaded',
          payload:
            s.status === 'loaded'
              ? [...s.payload, ...allUsersWithInvitableClubs]
              : allUsersWithInvitableClubs,
        }));
        setLoadingMoreUsers(false);
      }
    })();
    setLoadingMoreUsers(true);
  }, [user, userLoaded, afterUsersQuery]);

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

  function onSnackbarClose() {
    setSnackbarProps({ ...snackbarProps, isOpen: false });
  }

  function onCopyReferralLink() {
    setSnackbarProps({
      ...snackbarProps,
      isOpen: true,
      variant: 'info',
      message: 'Copied referral link to clipboard!',
    });
  }

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  function onCloseLoginModal() {
    setLoginModalShown(false);
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
      await resetLoadMoreClubs();
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
      await resetLoadMoreClubs();
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
      await resetLoadMoreClubs();
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
      await resetLoadMoreClubs();
      setActiveClubsFilter({
        ...activeClubsFilter,
        membership: stagingClubsFilter.membership,
      });
    }
    setShowMembershipFilter(false);
  }

  async function removeFilterChip(key: string, type: FilterChipType) {
    await resetLoadMoreClubs();
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

  const resetLoadMoreClubs = async () => {
    await setClubsTransformedResult(s => ({
      ...s,
      status: 'loading',
    }));
    await setAfterClubsQuery(undefined);
  };

  const onClearSearch = async () => {
    if (search !== '') {
      await resetLoadMoreClubs();
      setSearch('');
    }
  };

  const onSearchSubmitted = async (str: string) => {
    if (str !== search) {
      await resetLoadMoreClubs();
      setSearch(str);
    }
  };

  const onSeeClubsClick = () => {
    scroller.scrollTo('tabs', { smooth: true });
  };

  const centerComponent = (
    <>
      {screenSmallerThanSm ? (
        <img
          src={logo}
          alt="Caravan logo"
          style={{ height: 48, objectFit: 'contain' }}
        />
      ) : (
        <img
          src={textLogo}
          alt="Caravan logo"
          style={{ height: 20, objectFit: 'contain' }}
        />
      )}
    </>
  );

  const rightComponent = (
    <>
      <ShareIconButton user={user} onCopyReferralLink={onCopyReferralLink} />
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

  let emptyFilterResultMsg = 'Oops... no clubs turned up!';
  if (search.length > 0 && clubFiltersApplied) {
    emptyFilterResultMsg +=
      ' Try other search terms, or relaxing your filters.';
  } else if (search.length > 0) {
    emptyFilterResultMsg += ' Try other search terms.';
  } else if (clubFiltersApplied) {
    emptyFilterResultMsg += ' Try relaxing your filters.';
  }

  return (
    <>
      <Header
        centerComponent={centerComponent}
        rightComponent={rightComponent}
      />
      <main>
        {showWelcomeMessage && (
          <Splash
            user={user}
            onLoginClick={() => setLoginModalShown(true)}
            onDismissClick={() => setShowWelcomeMessage(false)}
            onSeeClubsClick={onSeeClubsClick}
          />
        )}
        <Element name="tabs">
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
        </Element>
        {tabValue === 0 && (
          <>
            <Container className={classes.filterGrid} maxWidth="md">
              <FilterSearch
                onClearSearch={onClearSearch}
                onSearchSubmitted={onSearchSubmitted}
              />
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
            {(clubsTransformedResult.status === 'loaded' ||
              clubsTransformedResult.status === 'loading') &&
              clubsTransformedResult.payload &&
              clubsTransformedResult.payload.length > 0 && (
                <ClubCards
                  clubsTransformed={clubsTransformedResult.payload}
                  showResultsCount={search.length > 0 || clubFiltersApplied}
                  resultsLoaded={clubsTransformedResult.status === 'loaded'}
                />
              )}
            {clubsTransformedResult.status === 'loaded' &&
              clubsTransformedResult.payload.length === 0 &&
              (clubFiltersApplied || search.length > 0) && (
                <Typography
                  color="textSecondary"
                  style={{
                    textAlign: 'center',
                    fontStyle: 'italic',
                    marginTop: theme.spacing(4),
                    marginBottom: theme.spacing(4),
                  }}
                >
                  {emptyFilterResultMsg}
                </Typography>
              )}
            {clubsTransformedResult.status === 'loaded' &&
              showLoadMoreClubs &&
              !loadingMoreClubs && (
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
                  >
                    <Typography variant="button">LOAD MORE...</Typography>
                  </Button>
                </div>
              )}
            {loadingMoreClubs && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <CircularProgress />
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
                  currUser={user}
                />
              )}
            {usersResult.status === 'loaded' &&
              showLoadMoreUsers &&
              !loadingMoreUsers && (
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
                    <Typography
                      variant="button"
                      style={{ textAlign: 'center' }}
                    >
                      LOAD MORE...
                    </Typography>
                  </Button>
                </div>
              )}
            {usersResult.status === 'loaded' &&
              showLoadMoreUsers &&
              loadingMoreUsers && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <CircularProgress />
                </div>
              )}
          </>
        )}
      </main>
      <DiscordLoginModal
        onCloseLoginDialog={onCloseLoginModal}
        open={loginModalShown}
      />
      <CustomSnackbar {...snackbarProps} />
    </>
  );
}
