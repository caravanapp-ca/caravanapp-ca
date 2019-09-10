import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Theme,
  createStyles,
  Typography,
  Container,
  CircularProgress,
  Button,
} from '@material-ui/core';
import { User, ClubTransformed } from '@caravan/buddy-reading-types';
import { RouteComponentProps } from 'react-router';
import Header from '../../components/Header';
import HeaderTitle from '../../components/HeaderTitle';
import { getUserClubRecommendations } from '../../services/club';
import ClubCards from '../home/ClubCards';
import { transformClub } from '../club/functions/ClubFunctions';
import ProfileHeaderIcon from '../../components/ProfileHeaderIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
    },
    loadMoreContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
);

interface RecommendedClubsProps extends RouteComponentProps<{}> {
  user: User | null;
}

const headerCenterComponent = <HeaderTitle title="Recommended Clubs" />;

const pageSize = 6;

export default function RecommendedClubs(props: RecommendedClubsProps) {
  const { user } = props;
  const classes = useStyles();
  const [clubs, setClubs] = useState<ClubTransformed[]>([]);
  const [loadStatus, setLoadStatus] = useState<'init' | 'loading' | 'loaded'>(
    'init'
  );
  // const [after, setAfter] = useState<string>();
  const [clubsReceivedIds, setClubsReceivedIds] = useState<string[]>([]);

  const loadMoreEnabled = clubs.length % pageSize === 0;
  const rightComponent = <ProfileHeaderIcon user={user} />;

  useEffect(() => {
    if (user) {
      const getRecommendations = async (userId: string) => {
        setLoadStatus('loading');
        const res = await getUserClubRecommendations(
          userId,
          pageSize,
          clubsReceivedIds
        );
        if (res.status === 404) {
          setClubs([]);
        } else if (res.status === 200) {
          setClubs(clubs => [
            ...clubs,
            ...res.data.map(c => transformClub(c.club, c.recommendation)),
          ]);
        } else {
          // This is an error condition.
          setClubs([]);
          // TODO: Show snackbar indicating we had trouble finding your clubs
        }
        setLoadStatus('loaded');
      };
      getRecommendations(user._id);
    }
  }, [user, clubsReceivedIds]);

  const onClickLoadMore = () => {
    if (loadStatus === 'loaded' && loadMoreEnabled) {
      setClubsReceivedIds(clubs.map(c => c.club._id));
    }
  };

  return (
    <>
      <Header
        centerComponent={headerCenterComponent}
        rightComponent={rightComponent}
      />
      <Container className={classes.root} maxWidth="md">
        {loadStatus === 'loading' && clubs.length === 0 && (
          <Typography>Hold on while we get your recommendations...</Typography>
        )}
        {(loadStatus === 'loaded' || loadStatus === 'loading') &&
          clubs.length > 0 && (
            <>
              <Typography>
                Here are some clubs we've hand picked for you!
              </Typography>
              <ClubCards clubsTransformed={clubs} />
            </>
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
    </>
  );
}
