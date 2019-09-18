import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import queryString from 'query-string';
import { makeStyles } from '@material-ui/styles';
import {
  Theme,
  createStyles,
  Typography,
  Container,
  CircularProgress,
  Button,
  IconButton,
} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import {
  User,
  ClubTransformed,
  ClubWithRecommendation,
} from '@caravan/buddy-reading-types';
import { RouteComponentProps, Redirect } from 'react-router';
import Header from '../../components/Header';
import HeaderTitle from '../../components/HeaderTitle';
import {
  getUserClubRecommendations,
  getUserReferralClub,
} from '../../services/club';
import ClubCards from '../home/ClubCards';
import { transformClub } from '../club/functions/ClubFunctions';
import ProfileHeaderIcon from '../../components/ProfileHeaderIcon';
import CustomSnackbar, {
  CustomSnackbarProps,
} from '../../components/CustomSnackbar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
    },
    cardsContainer: {
      padding: `${theme.spacing(4)}px 0px ${theme.spacing(4)}px 0px`,
    },
    cardsContainerTop: {
      paddingBottom: 0,
    },
    headerText: {
      marginBottom: theme.spacing(2),
    },
    loadMoreContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing(4),
    },
  })
);

interface RecommendedClubsProps extends RouteComponentProps<{}> {
  user: User | null;
  userLoaded: boolean;
}

const pageSize = 6;

export default function RecommendedClubs(props: RecommendedClubsProps) {
  const { user, userLoaded } = props;
  const query = queryString.parse(props.location.search);
  const fromOnboarding = query.fromOnboarding === 'true';
  const classes = useStyles();
  const [clubs, setClubs] = useState<ClubTransformed[]>([]);
  const [referralClub, setReferralClub] = useState<ClubTransformed | undefined>(
    undefined
  );
  const [loadStatus, setLoadStatus] = useState<'init' | 'loading' | 'loaded'>(
    'init'
  );
  const [loadReferralStatus, setLoadReferralStatus] = useState<
    'init' | 'disabled' | 'loading' | 'loaded'
  >('init');
  const [clubsReceivedIds, setClubsReceivedIds] = useState<string[]>([]);
  const [wasMember, setWasMember] = useState<true | false | 'loading'>(
    'loading'
  );
  const [snackbarProps, setSnackbarProps] = React.useState<CustomSnackbarProps>(
    {
      autoHideDuration: 6000,
      isOpen: false,
      handleClose: onSnackbarClose,
      variant: 'info',
    }
  );

  const loadMoreEnabled = clubs.length % pageSize === 0;
  const showAutoJoinedMsg = fromOnboarding && wasMember;
  const backButtonAction = () => {
    if (props.history.length > 2) {
      props.history.goBack();
    } else {
      props.history.replace('/');
    }
  };
  const leftComponent = fromOnboarding ? (
    undefined
  ) : (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="Back"
      onClick={backButtonAction}
    >
      <ArrowBackIos />
    </IconButton>
  );
  const centerComponent = (
    <HeaderTitle title={fromOnboarding ? 'Join Clubs' : 'Recommended Clubs'} />
  );
  const rightComponent = fromOnboarding ? (
    <Button href="/" color="primary">
      <Typography variant="button">CONTINUE</Typography>
    </Button>
  ) : (
    <ProfileHeaderIcon user={user} />
  );

  // If we came from onboarding, we should retrieve the user's referred clubs, if any.
  useEffect(() => {
    if (!user || !userLoaded) {
      return;
    }
    if (fromOnboarding) {
      const getReferralClub = async (userId: string) => {
        setLoadReferralStatus('loading');
        const res = await getUserReferralClub(userId);
        if (!res) {
          setReferralClub(undefined);
          setSnackbarProps(sbp => ({
            ...sbp,
            isOpen: true,
            variant: 'warning',
            message:
              "We ran into some trouble retrieving clubs you've been referred to.",
          }));
          return;
        }
        if (res.status >= 200 && res.status < 300) {
          const data = res.data as ClubWithRecommendation;
          const { club, recommendation, isMember } = data;
          setReferralClub(transformClub(club, recommendation, isMember));
          setWasMember(isMember);
        } else {
          setReferralClub(undefined);
          if (res.status !== 404) {
            // This is an error condition.
            setSnackbarProps(sbp => ({
              ...sbp,
              isOpen: true,
              variant: 'warning',
              message:
                "We ran into some trouble retrieving clubs you've been referred to.",
            }));
          }
        }
        setLoadReferralStatus('loaded');
      };
      getReferralClub(user._id);
    } else {
      setLoadReferralStatus('disabled');
    }
  }, [fromOnboarding, user, userLoaded]);

  useEffect(() => {
    if (!user || !userLoaded) {
      return;
    }
    const getRecommendations = async (userId: string) => {
      setLoadStatus('loading');
      const res = await getUserClubRecommendations(
        userId,
        pageSize,
        clubsReceivedIds
      );
      if (res.status === 200) {
        setClubs(clubs => [
          ...clubs,
          ...res.data.map(c =>
            transformClub(c.club, c.recommendation, c.isMember)
          ),
        ]);
      } else {
        setClubs([]);
        if (res.status !== 404) {
          // This is an error condition.
          setSnackbarProps(sbp => ({
            ...sbp,
            isOpen: true,
            variant: 'warning',
            message:
              'We ran into some trouble retrieving your recommended clubs. Try logging out/in, then contact the Caravan team on Discord.',
          }));
        }
      }
      setLoadStatus('loaded');
    };
    getRecommendations(user._id);
  }, [clubsReceivedIds, user, userLoaded]);

  if (!user && userLoaded) {
    return <Redirect to="/" />;
  }

  const onClickLoadMore = () => {
    if (loadStatus === 'loaded' && loadMoreEnabled) {
      setClubsReceivedIds(clubs.map(c => c.club._id));
    }
  };

  function onSnackbarClose() {
    setSnackbarProps({ ...snackbarProps, isOpen: false });
  }

  return (
    <>
      <Header
        leftComponent={leftComponent}
        centerComponent={centerComponent}
        rightComponent={rightComponent}
      />
      <Container className={classes.root} maxWidth="md">
        {loadStatus === 'loading' && clubs.length === 0 && (
          <Typography>Hold on while we get your recommendations...</Typography>
        )}
        {(loadReferralStatus === 'loaded' ||
          loadReferralStatus === 'loading') &&
          referralClub && (
            <div
              className={clsx(
                classes.cardsContainer,
                classes.cardsContainerTop
              )}
            >
              <Typography
                variant="h6"
                className={showAutoJoinedMsg ? undefined : classes.headerText}
              >
                You were referred to these clubs.
              </Typography>
              {showAutoJoinedMsg && (
                <Typography
                  className={classes.headerText}
                  color="textSecondary"
                  style={{ fontStyle: 'italic' }}
                >
                  You've been automatically joined, so don't worry about it!
                </Typography>
              )}
              <ClubCards
                clubsTransformed={[referralClub]}
                quickJoin={true}
                isLoggedIn={!!user}
              />
            </div>
          )}
        {(loadStatus === 'loaded' || loadStatus === 'loading') &&
          clubs.length > 0 && (
            <div className={classes.cardsContainer}>
              <Typography variant="h6" className={classes.headerText}>
                Here are some clubs we've hand picked for you.
              </Typography>
              <ClubCards
                clubsTransformed={clubs}
                quickJoin={true}
                isLoggedIn={!!user}
              />
            </div>
          )}
        {loadStatus === 'loaded' && clubs.length === 0 && (
          <Typography>
            Somethings wrong! We were unable to find any recommended clubs for
            you. The Caravan team has been notified and is working on it.
          </Typography>
        )}
        {loadMoreEnabled && (
          <div className={classes.loadMoreContainer}>
            {loadStatus === 'loaded' && (
              <Button
                variant="outlined"
                onClick={onClickLoadMore}
                color="primary"
              >
                <Typography variant="button">LOAD MORE</Typography>
              </Button>
            )}
            {loadStatus === 'loading' && <CircularProgress size={36} />}
          </div>
        )}
      </Container>
      <CustomSnackbar {...snackbarProps} />
    </>
  );
}
