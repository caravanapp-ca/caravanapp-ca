import React, { useEffect } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Element as ScrollElement, scroller } from 'react-scroll';

import {
  ActiveFilter,
  Capacity,
  ClubTransformed,
  ClubWithMemberIds,
  FilterChip,
  FilterChipType,
  Membership,
  PostSearchField,
  PostUserInfo,
  PostWithAuthorInfoAndLikes,
  ReadingSpeed,
  Services,
  User,
  UserSearchField,
  UserWithInvitableClubs,
} from '@caravanapp/types';
import {
  Button,
  CircularProgress,
  Container,
  IconButton,
  makeStyles,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import { KEY_HIDE_WELCOME_CLUBS } from '../../common/localStorage';
import { Service } from '../../common/service';
import shuffleArr from '../../common/shuffleArr';
import AdapterLink from '../../components/AdapterLink';
import CustomSnackbar, {
  CustomSnackbarProps,
} from '../../components/CustomSnackbar';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import CapacityModal from '../../components/filters/CapacityModal';
import ClubFilters from '../../components/filters/ClubFilters';
import FilterChips from '../../components/filters/FilterChips';
import FilterSearch from '../../components/filters/FilterSearch';
import GenreFilterModal from '../../components/filters/GenreFilterModal';
import MembershipModal from '../../components/filters/MembershipModal';
import PostSearchFilter from '../../components/filters/PostSearchFilter';
import ReadingSpeedModal from '../../components/filters/ReadingSpeedModal';
import UserSearchFilter from '../../components/filters/UserSearchFilter';
import Header from '../../components/Header';
import ProfileHeaderIcon from '../../components/ProfileHeaderIcon';
import ShareIconButton from '../../components/ShareIconButton';
import logo from '../../resources/logo.svg';
import textLogo from '../../resources/text-logo.svg';
import { getAllClubs, getUserClubsWithMembers } from '../../services/club';
import { getAllGenres } from '../../services/genre';
import {
  getAllPostsTransformed,
  getFeedViewerUserInfo,
} from '../../services/post';
import { getAllUsers } from '../../services/user';
import theme, { washedTheme } from '../../theme';
import { transformClub } from '../club/functions/ClubFunctions';
import Composer from '../post/Composer';
import ClubCards from './ClubCards';
import PostCards from './PostCards';
import Splash from './Splash';
import UserCards from './UserCards';

interface HomeProps extends RouteComponentProps<{}> {
  user: User | null;
  userLoaded: boolean;
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
    //For some reason the "create club" icon button had marginLeft = -12
    marginLeft: 0,
  },
  clubsFilterGrid: {
    marginTop: '16px',
    padding: '0px 16px',
    display: 'flex',
    flexDirection: 'column',
  },
  usersFilterGrid: {
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
  cardsContainer: {
    padding: `32px 0px 32px 0px`,
  },
  viewRecommendationsContainer: {
    marginTop: theme.spacing(2),
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

const centerComponent = (
  <>
    {window.innerWidth < theme.breakpoints.values.sm ? (
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

export default function Home(props: HomeProps) {
  const { user, userLoaded } = props;
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory<{
    clubsFilter?: ActiveFilter;
    clubsSearch?: string;
    postsSearch?: string;
    postSearchField?: PostSearchField;
    tab?: number;
    usersSearch?: string;
    userSearchField?: UserSearchField;
  }>();
  const { location } = history;

  const [clubsTransformedResult, setClubsTransformedResult] = React.useState<
    Service<ClubTransformed[]>
  >({ status: 'loading' });
  const [usersResult, setUsersResult] = React.useState<
    Service<UserWithInvitableClubs[]>
  >({ status: 'loading' });
  const [postsResult, setPostsResult] = React.useState<
    Service<PostWithAuthorInfoAndLikes[]>
  >({
    status: 'loading',
  });
  const [feedViewerUserInfo, setFeedViewerUserInfo] =
    React.useState<PostUserInfo | null>(null);
  const [loadingMoreUsers, setLoadingMoreUsers] =
    React.useState<boolean>(false);
  const [loadingMoreClubs, setLoadingMoreClubs] =
    React.useState<boolean>(false);
  const [loadingMorePosts, setLoadingMorePosts] =
    React.useState<boolean>(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = React.useState(
    localStorage.getItem(KEY_HIDE_WELCOME_CLUBS) !== 'yes'
  );
  const allowedTabs = [0, 1, 2];
  const [tabValue, setTabValue] = React.useState(
    location.state &&
      location.state.tab &&
      allowedTabs.includes(location.state.tab)
      ? location.state.tab
      : 0
  );
  const [userSearchField, setUserSearchField] = React.useState<UserSearchField>(
    location.state && location.state.userSearchField
      ? location.state.userSearchField
      : 'username'
  );
  const [postSearchField, setPostSearchField] = React.useState<PostSearchField>(
    location.state && location.state.postSearchField
      ? location.state.postSearchField
      : 'bookTitle'
  );
  const [loginModalShown, setLoginModalShown] = React.useState(false);
  const [afterClubsQuery, setAfterClubsQuery] = React.useState<
    string | undefined
  >(undefined);
  const [afterUsersQuery, setAfterUsersQuery] = React.useState<
    string | undefined
  >(undefined);
  const [afterPostsQuery, setAfterPostsQuery] = React.useState<
    string | undefined
  >(undefined);
  const [showLoadMoreClubs, setShowLoadMoreClubs] = React.useState(false);
  const [showLoadMoreUsers, setShowLoadMoreUsers] = React.useState(false);
  const [showLoadMorePosts, setShowLoadMorePosts] = React.useState(false);
  const [allGenres, setAllGenres] = React.useState<Services.GetGenres | null>(
    null
  );
  const [showGenreFilter, setShowGenreFilter] = React.useState(false);
  const [showSpeedFilter, setShowSpeedFilter] = React.useState(false);
  const [showCapacityFilter, setShowCapacityFilter] = React.useState(false);
  const [showMembershipFilter, setShowMembershipFilter] = React.useState(false);
  const [stagingClubsFilter, setStagingClubsFilter] =
    React.useState<ActiveFilter>(
      location.state && location.state.clubsFilter
        ? location.state.clubsFilter
        : defaultActiveFilter
    );
  const [activeClubsFilter, setActiveClubsFilter] =
    React.useState<ActiveFilter>(
      location.state && location.state.clubsFilter
        ? location.state.clubsFilter
        : defaultActiveFilter
    );
  const clubGenreFiltersApplied = activeClubsFilter.genres.length > 0;
  const clubSpeedFiltersApplied = activeClubsFilter.speed.length > 0;
  const clubCapacityFiltersApplied = activeClubsFilter.capacity.length > 0;
  const clubMembershipFiltersApplied = activeClubsFilter.membership.length > 0;
  const clubFiltersApplied =
    clubGenreFiltersApplied ||
    clubSpeedFiltersApplied ||
    clubCapacityFiltersApplied ||
    clubMembershipFiltersApplied;
  const [clubsSearch, setClubsSearch] = React.useState<string>(
    location.state && location.state.clubsSearch
      ? location.state.clubsSearch
      : ''
  );
  const [usersSearch, setUsersSearch] = React.useState<string>(
    location.state && location.state.usersSearch
      ? location.state.usersSearch
      : ''
  );
  const [postsSearch, setPostsSearch] = React.useState<string>(
    location.state && location.state.postsSearch
      ? location.state.postsSearch
      : ''
  );

  const screenSmallerThanSm = useMediaQuery(theme.breakpoints.down('xs'));
  const screenSmallerThanMd = useMediaQuery(theme.breakpoints.down('sm'));

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
        clubsSearch
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
    clubsSearch,
  ]);

  useEffect(() => {
    if (!userLoaded) {
      return;
    }
    const pageSize = 12;
    setLoadingMoreUsers(true);
    (async () => {
      const res = await getAllUsers(
        afterUsersQuery,
        1,
        pageSize,
        usersSearch,
        userSearchField
      );
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
              capacity: [],
              membership: [
                { key: 'myClubs', name: 'My clubs', type: 'membership' },
              ],
            }
          );
          if (currUserClubsRes.status === 200) {
            const clubsWithOpenSpots = currUserClubsRes.data.filter(
              c => c.members.length < c.maxMembers
            );
            currUserClubsWithMembers = clubsWithOpenSpots.map(c => {
              const memberIds = c.members.map(m => m._id);
              return { club: c, memberIds };
            });
          }
        }
        const allUsers = res.data ? res.data.users : undefined;
        const allUsersShuffled = allUsers
          ? allUsers.map(user => shuffleUser(user))
          : undefined;
        const allUsersWithInvitableClubs = allUsersShuffled
          ? transformUserToInvitableClub(
              allUsersShuffled,
              currUserClubsWithMembers
            )
          : undefined;
        if (allUsersWithInvitableClubs) {
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
      }
    })();
    setLoadingMoreUsers(true);
  }, [user, userLoaded, afterUsersQuery, usersSearch, userSearchField]);

  useEffect(() => {
    if (!userLoaded) {
      return;
    }
    const pageSize = 12;
    setLoadingMorePosts(true);
    (async () => {
      const res = await getAllPostsTransformed(
        afterPostsQuery,
        pageSize,
        postsSearch,
        postSearchField
      );
      if (res.status === 200) {
        const allPostsWithAuthorInfoAndLikes = res.data
          ? res.data.posts
          : undefined;
        if (allPostsWithAuthorInfoAndLikes) {
          setShowLoadMorePosts(
            allPostsWithAuthorInfoAndLikes.length === pageSize
          );
          setPostsResult(s => ({
            status: 'loaded',
            payload:
              s.status === 'loaded'
                ? [...s.payload, ...allPostsWithAuthorInfoAndLikes]
                : allPostsWithAuthorInfoAndLikes,
          }));
          setLoadingMorePosts(false);
        }
      }
      if (user) {
        const feedViewerUserInfoRes = await getFeedViewerUserInfo(user._id);
        if (feedViewerUserInfoRes.status === 200) {
          setFeedViewerUserInfo(feedViewerUserInfoRes.data);
        }
      }
    })();
    setLoadingMorePosts(true);
  }, [user, userLoaded, afterPostsQuery, postsSearch, postSearchField]);

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

  // These useEffects write the tab, search, and filter values to prop.history.location.state so that they can be
  // retrieved when the user navigates back to the home screen. When the user logs out the whole
  // history.location.state object is cleared. Note: when you logout then log back in,
  // history.location.state begins as undefined. The first useEffect (triggered by tabValue) initializes the
  // history.location.state object so that the other useEffects can modify their fields without error (see the
  // else statement in the useEffect below)
  useEffect(() => {
    if (history.location.state) {
      const newState = history.location.state;
      newState.tab = tabValue;
      history.replace({ state: newState });
    } else {
      history.replace({ state: { tab: tabValue } });
    }
  }, [tabValue, history]);

  useEffect(() => {
    if (history.location.state) {
      const newState = history.location.state;
      newState.clubsFilter = activeClubsFilter;
      history.replace({ state: newState });
    }
  }, [activeClubsFilter, history]);

  useEffect(() => {
    if (history.location.state) {
      const newState = history.location.state;
      newState.clubsSearch = clubsSearch;
      history.replace({ state: newState });
    }
  }, [clubsSearch, history]);

  useEffect(() => {
    if (history.location.state) {
      const newState = history.location.state;
      newState.usersSearch = usersSearch;
      history.replace({ state: newState });
    }
  }, [usersSearch, history]);

  useEffect(() => {
    if (history.location.state) {
      const newState = history.location.state;
      newState.userSearchField = userSearchField;
      history.replace({ state: newState });
    }
  }, [userSearchField, history]);

  useEffect(() => {
    if (history.location.state) {
      const newState = history.location.state;
      newState.postsSearch = postsSearch;
      history.replace({ state: newState });
    }
  }, [postsSearch, history]);

  useEffect(() => {
    if (history.location.state) {
      const newState = history.location.state;
      newState.postSearchField = postSearchField;
      history.replace({ state: newState });
    }
  }, [postSearchField, history]);

  function onSharePost() {
    setSnackbarProps({
      ...snackbarProps,
      isOpen: true,
      variant: 'info',
      message: screenSmallerThanSm
        ? 'Copied shelf link to clipboard!'
        : 'Copied shelf link to clipboard. Share this shelf with the world!',
    });
  }

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

  const handleUserSearchFieldChange = async (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const userSearchFieldValue = event.target.value as UserSearchField;
    setUserSearchField(userSearchFieldValue);
    resetLoadMoreUsers();
  };

  const handlePostSearchFieldChange = async (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const postSearchFieldValue = event.target.value as PostSearchField;
    setPostSearchField(postSearchFieldValue);
    await resetLoadMorePosts();
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

  const onClearClubsSearch = async () => {
    if (clubsSearch !== '') {
      await resetLoadMoreClubs();
      setClubsSearch('');
    }
  };

  const onSearchClubsSubmitted = async (str: string) => {
    if (str !== clubsSearch) {
      await resetLoadMoreClubs();
      setClubsSearch(str);
    }
  };

  const resetLoadMoreUsers = async () => {
    await setUsersResult(s => ({
      ...s,
      status: 'loading',
    }));
    await setAfterUsersQuery(undefined);
  };

  const onClearUsersSearch = async () => {
    if (usersSearch !== '') {
      await resetLoadMoreUsers();
      setUsersSearch('');
    }
  };

  const onSearchUsersSubmitted = async (str: string) => {
    if (str !== usersSearch) {
      await resetLoadMoreUsers();
      setUsersSearch(str);
    }
  };

  const resetLoadMorePosts = async () => {
    await setPostsResult(s => ({
      ...s,
      status: 'loading',
    }));
    await setAfterPostsQuery(undefined);
  };

  const onClearPostsSearch = async () => {
    if (postsSearch !== '') {
      await resetLoadMorePosts();
      setPostsSearch('');
    }
  };

  const onSearchPostsSubmitted = async (str: string) => {
    if (str !== postsSearch) {
      await resetLoadMorePosts();
      setPostsSearch(str);
    }
  };

  const onSeeClubsClick = () => {
    setTabValue(0);
    scroller.scrollTo('tabs', { smooth: true });
  };

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

  let emptyClubsFilterResultMsg = 'Oops... no clubs turned up!';
  if (clubsSearch.length > 0 && clubFiltersApplied) {
    emptyClubsFilterResultMsg +=
      ' Try other search terms, or relaxing your filters.';
  } else if (clubsSearch.length > 0) {
    emptyClubsFilterResultMsg += ' Try other search terms.';
  } else if (clubFiltersApplied) {
    emptyClubsFilterResultMsg += ' Try relaxing your filters.';
  }

  let emptyUsersFilterResultMsg = 'Oops...no users turned up!';
  if (usersSearch.length > 0) {
    emptyUsersFilterResultMsg += ' Try other search terms.';
  }

  let emptyPostsFilterResultMsg = 'Oops...no shelves turned up!';
  if (postsSearch.length > 0) {
    emptyPostsFilterResultMsg += ' Try other search terms.';
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
        <ScrollElement name="tabs">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant={screenSmallerThanMd ? 'fullWidth' : undefined}
            centered={!screenSmallerThanMd}
          >
            <Tab label="Join Clubs" style={{ fontSize: '13px' }} />
            <Tab label="Find A Buddy" style={{ fontSize: '13px' }} />
            <Tab label="Find Books" style={{ fontSize: '13px' }} />
          </Tabs>
        </ScrollElement>
        {tabValue === 0 && (
          <>
            <Container className={classes.clubsFilterGrid} maxWidth="md">
              <div className={classes.viewRecommendationsContainer}>
                <Button
                  variant="contained"
                  color="primary"
                  href={user ? '/clubs/recommend' : undefined}
                  onClick={user ? undefined : () => setLoginModalShown(true)}
                  fullWidth={screenSmallerThanSm}
                >
                  <Typography variant="button">
                    VIEW MY RECOMMENDATIONS
                  </Typography>
                </Button>
              </div>
              <FilterSearch
                onClearSearch={onClearClubsSearch}
                onSearchSubmitted={onSearchClubsSubmitted}
                searchBoxLabel={
                  'Search clubs by club name, book title, or author'
                }
                searchBoxLabelSmall={'Search clubs'}
                searchBoxId={'club-search'}
                loadingMore={loadingMoreClubs}
                searchText={clubsSearch}
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
              {(clubsTransformedResult.status === 'loaded' ||
                clubsTransformedResult.status === 'loading') &&
                clubsTransformedResult.payload &&
                clubsTransformedResult.payload.length > 0 && (
                  <div className={classes.cardsContainer}>
                    <ClubCards
                      clubsTransformed={clubsTransformedResult.payload}
                      showResultsCount={
                        clubsSearch.length > 0 || clubFiltersApplied
                      }
                      resultsLoaded={clubsTransformedResult.status === 'loaded'}
                    />
                  </div>
                )}
            </Container>
            {clubsTransformedResult.status === 'loaded' &&
              clubsTransformedResult.payload.length === 0 &&
              (clubFiltersApplied || clubsSearch.length > 0) && (
                <Typography
                  color="textSecondary"
                  style={{
                    textAlign: 'center',
                    fontStyle: 'italic',
                    marginTop: theme.spacing(4),
                    marginBottom: theme.spacing(4),
                  }}
                >
                  {emptyClubsFilterResultMsg}
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
            {clubsTransformedResult.status === 'loaded' &&
              showLoadMoreClubs &&
              loadingMoreClubs && (
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
            <Container className={classes.usersFilterGrid} maxWidth="md">
              <FilterSearch
                onClearSearch={onClearUsersSearch}
                onSearchSubmitted={onSearchUsersSubmitted}
                searchBoxLabel={
                  userSearchField === 'bookTitle'
                    ? 'Search users by titles of books on their shelf'
                    : userSearchField === 'bookAuthor'
                    ? 'Search users by authors of books on their shelf'
                    : 'Search users by username'
                }
                searchBoxLabelSmall={'Search users'}
                searchBoxId={'users-search'}
                loadingMore={loadingMoreUsers}
                searchText={usersSearch}
              />
              <UserSearchFilter
                handleChange={handleUserSearchFieldChange}
                searchField={userSearchField}
              />
            </Container>
            {(usersResult.status === 'loaded' ||
              usersResult.status === 'loading') &&
              usersResult.payload &&
              usersResult.payload.length > 0 && (
                <UserCards
                  usersWithInvitableClubs={usersResult.payload}
                  currUser={user}
                  showResultsCount={usersSearch.length > 0}
                  resultsLoaded={usersResult.status === 'loaded'}
                />
              )}
            {usersResult.status === 'loaded' &&
              usersResult.payload.length === 0 &&
              usersSearch.length > 0 && (
                <Typography
                  color="textSecondary"
                  style={{
                    textAlign: 'center',
                    fontStyle: 'italic',
                    marginTop: theme.spacing(4),
                    marginBottom: theme.spacing(4),
                  }}
                >
                  {emptyUsersFilterResultMsg}
                </Typography>
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
        {tabValue === 2 && (
          <>
            <Container className={classes.usersFilterGrid} maxWidth="md">
              <Composer currUserInfo={user ? feedViewerUserInfo : null} />
              <FilterSearch
                onClearSearch={onClearPostsSearch}
                onSearchSubmitted={onSearchPostsSubmitted}
                searchBoxLabel={
                  postSearchField === 'bookTitle'
                    ? 'Search shelves by book title'
                    : postSearchField === 'bookAuthor'
                    ? 'Search shelves by book author'
                    : 'Search shelves by shelf title'
                }
                searchBoxLabelSmall={'Search shelves'}
                searchBoxId={'shelf-search'}
                loadingMore={loadingMorePosts}
                searchText={postsSearch}
              />
              <PostSearchFilter
                handleChange={handlePostSearchFieldChange}
                searchField={postSearchField}
              />
            </Container>
            {(postsResult.status === 'loaded' ||
              postsResult.status === 'loading') &&
              postsResult.payload &&
              postsResult.payload.length > 0 && (
                <PostCards
                  postsWithAuthorInfoAndLikes={postsResult.payload}
                  feedViewerUserInfo={feedViewerUserInfo}
                  currUser={user}
                  showResultsCount={postsSearch.length > 0}
                  resultsLoaded={postsResult.status === 'loaded'}
                  onSharePost={onSharePost}
                />
              )}
            {postsResult.status === 'loaded' &&
              postsResult.payload.length === 0 &&
              postsSearch.length > 0 && (
                <Typography
                  color="textSecondary"
                  style={{
                    textAlign: 'center',
                    fontStyle: 'italic',
                    marginTop: theme.spacing(4),
                    marginBottom: theme.spacing(4),
                  }}
                >
                  {emptyPostsFilterResultMsg}
                </Typography>
              )}
            {postsResult.status === 'loaded' &&
              showLoadMorePosts &&
              !loadingMorePosts && (
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
                      setAfterPostsQuery(
                        postsResult.payload[postsResult.payload.length - 1].post
                          ._id
                      )
                    }
                  >
                    <Typography variant="button">LOAD MORE...</Typography>
                  </Button>
                </div>
              )}
            {postsResult.status === 'loaded' &&
              showLoadMorePosts &&
              loadingMorePosts && (
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
