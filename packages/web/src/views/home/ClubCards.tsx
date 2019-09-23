import React, { useEffect } from 'react';
import { isAfter, addDays, differenceInHours, format } from 'date-fns';
import clsx from 'clsx';
import LazyLoad from 'react-lazyload';
import Truncate from 'react-truncate';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { Info } from '@material-ui/icons';
import {
  Services,
  ClubTransformedRecommended,
} from '@caravan/buddy-reading-types';
import {
  groupVibeIcons,
  groupVibeLabels,
} from '../../components/group-vibe-avatars-icons-labels';
import { UNLIMITED_CLUB_MEMBERS_VALUE } from '../../common/globalConstants';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import EndAvatar from '../../components/misc-avatars-icons-labels/avatars/EndAvatar';
import GenericGroupMemberAvatar from '../../components/misc-avatars-icons-labels/avatars/GenericGroupMemberAvatar';
import PlaceholderCard from '../../components/PlaceholderCard';
import StartAvatar from '../../components/misc-avatars-icons-labels/avatars/StartAvatar';
import theme, { washedTheme, successTheme, whiteTheme } from '../../theme';
import { modifyMyClubMembership } from '../../services/club';
import CustomSnackbar, {
  CustomSnackbarProps,
} from '../../components/CustomSnackbar';
import ReactResizeDetector from 'react-resize-detector';

const joinProgressIndicatorSize = 24;

const useStyles = makeStyles(theme => ({
  cardGrid: {},
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    position: 'relative',
    zIndex: 1,
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  iconWithLabel: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLabel: {
    marginLeft: 8,
  },
  iconRoot: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    margin: theme.spacing(1),
  },
  clubImageContainer: {
    position: 'relative',
    borderRadius: '4px',
    height: '194px',
    width: '100%',
  },
  clubImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    objectFit: 'cover',
    objectPosition: '50% 50%',
    filter: 'blur(4px)',
  },
  clubImageShade: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    background: 'rgba(0, 0, 0, 0.4)',
  },
  imageTextContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
    padding: theme.spacing(2),
  },
  recommendationCaptionContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    top: 0,
    left: 0,
    padding: theme.spacing(2),
  },
  imageText: {
    width: '100%',
    textAlign: 'left',
    color: '#FFFFFF',
  },
  imageTitleText: {
    width: '100%',
    textAlign: 'left',
    color: '#FFFFFF',
    fontWeight: 600,
  },
  recommendationCaptionText: {
    width: '100%',
    textAlign: 'left',
    color: '#FFFFFF',
    marginLeft: theme.spacing(1),
    fontStyle: 'italic',
  },
  progressText: {},
  clubTitle: {
    fontWeight: 600,
  },
  attributeElement: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  attributeLabel: {
    marginLeft: 8,
  },
  creationInfoContainer: {
    display: 'flex',
    flex: 1,
    height: '100%',
    padding: 8,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  clubAttributesContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginTop: theme.spacing(1),
  },
  clubAttributesSubcontainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  clubAttributesCell: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  topCell: {
    alignItems: 'flex-start',
  },
  bottomCell: {
    alignItems: 'flex-end',
  },
  clubAttributesProgress: {
    display: 'flex',
    marginTop: theme.spacing(1),
    width: '100%',
    marginLeft: 19,
    paddingLeft: 19 + theme.spacing(1),
    borderLeft: `2px solid ${washedTheme.palette.primary.main}`,
  },
  joinProgressIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -joinProgressIndicatorSize / 2,
    marginTop: -joinProgressIndicatorSize / 2,
  },
  buttonWrapper: {
    position: 'relative',
  },
  joinButtonText: {
    color: '#FFFFFF',
  },
  actionButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));

interface ClubCardsProps {
  clubsTransformed: ClubTransformedRecommended[];
  showResultsCount?: boolean;
  resultsLoaded?: boolean;
  quickJoin?: boolean;
  isLoggedIn?: boolean;
}

// Make this approximately the height of a standard ClubCard
const placeholderCardHeight = 525;
// The number of cards above and below the current to load
const lazyloadOffset = 8;

export default function ClubCards(props: ClubCardsProps) {
  const classes = useStyles();
  const {
    clubsTransformed,
    showResultsCount,
    resultsLoaded,
    quickJoin,
    isLoggedIn,
  } = props;
  const [clubsTransformedState, setClubsTransformedState] = React.useState(
    clubsTransformed
  );
  const [loginModalShown, setLoginModalShown] = React.useState(false);
  const [snackbarProps, setSnackbarProps] = React.useState<CustomSnackbarProps>(
    {
      autoHideDuration: 6000,
      isOpen: false,
      handleClose: onSnackbarClose,
      variant: 'info',
    }
  );
  const [
    creationInfoContainerWidth,
    setCreationInfoContainerWidth,
  ] = React.useState<number>(128);

  useEffect(() => {
    setClubsTransformedState(clubsTransformed);
  }, [clubsTransformed]);

  const onChangeMembership = async (
    club: Services.GetClubs['clubs'][0],
    index: number,
    newIsMember: boolean
  ) => {
    setClubsTransformedState(clubs => {
      const newClubs = [...clubs];
      newClubs[index].isChangingMembership = true;
      return newClubs;
    });
    const result = await modifyMyClubMembership(club._id, newIsMember);
    if (result.status >= 200 && result.status < 300) {
      // Success
      setClubsTransformedState(clubs => {
        const newClubs = [...clubs];
        newClubs[index].isMember = newIsMember;
        return newClubs;
      });
      const successfulSnackBarMessage = newIsMember
        ? `Successfully joined ${club.name}!`
        : `Successfully left ${club.name}!`;
      setSnackbarProps({
        ...snackbarProps,
        isOpen: true,
        variant: 'success',
        message: successfulSnackBarMessage,
      });
    } else {
      // Failure
      const unsuccessfulSnackBarMessageVerb = newIsMember
        ? 'joining'
        : 'leaving';
      setSnackbarProps({
        ...snackbarProps,
        isOpen: true,
        variant: 'warning',
        message: `We ran into some trouble ${unsuccessfulSnackBarMessageVerb}. Try logging out then back in, then contact the Caravan team on Discord.`,
      });
    }
    setClubsTransformedState(clubs => {
      const newClubs = [...clubs];
      newClubs[index].isChangingMembership = false;
      return newClubs;
    });
  };

  function onSnackbarClose() {
    setSnackbarProps({ ...snackbarProps, isOpen: false });
  }

  const onCloseLoginDialog = () => {
    setLoginModalShown(false);
  };

  return (
    <>
      {showResultsCount && resultsLoaded && (
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {`${clubsTransformed.length} result${
            clubsTransformed.length === 1 ? '' : 's'
          }`}
        </Typography>
      )}
      <Grid container spacing={4}>
        {clubsTransformedState.map((c, index) => {
          const {
            club,
            schedule,
            recommendation,
            isMember,
            isChangingMembership,
          } = c;
          const currentlyReading = club.newShelf.current[0];
          let year;
          if (currentlyReading && currentlyReading.publishedDate) {
            year = format(new Date(currentlyReading.publishedDate), 'yyyy');
          }
          let startMsg = 'Start: Not set';
          let endMsg = 'End: Not set';
          let progress = 0;
          if (schedule && schedule.startDate) {
            const { startDate, duration } = schedule;
            if (isAfter(new Date(), startDate)) {
              startMsg = `Started: ${format(startDate, 'LLL')} ${format(
                startDate,
                'd'
              )}`;
            } else {
              startMsg = `Starts: ${format(startDate, 'LLL')} ${format(
                startDate,
                'd'
              )}`;
            }
            if (duration) {
              const endDate = addDays(startDate, duration * 7);
              progress = Math.min(
                Math.max(
                  differenceInHours(new Date(), startDate) /
                    differenceInHours(endDate, startDate),
                  0
                ),
                1
              );
              if (isAfter(new Date(), endDate)) {
                endMsg = `Ended: ${format(endDate, 'LLL')} ${format(
                  endDate,
                  'd'
                )}`;
              } else {
                endMsg = `Ends: ${format(endDate, 'LLL')} ${format(
                  endDate,
                  'd'
                )}`;
              }
            }
          }
          let groupVibeAvatar: JSX.Element | undefined;
          let groupVibeLabel: string | undefined;
          if (club.vibe) {
            groupVibeAvatar = groupVibeIcons(club.vibe, 'avatar');
            groupVibeLabel = groupVibeLabels(club.vibe);
          }
          return (
            <LazyLoad
              key={club._id}
              unmountIfInvisible={true}
              offset={placeholderCardHeight * lazyloadOffset}
              placeholder={
                <Grid item key={club._id} xs={12} sm={6}>
                  <PlaceholderCard height={placeholderCardHeight} />
                </Grid>
              }
            >
              <Grid item key={club._id} xs={12} sm={6}>
                <Card className={classes.card}>
                  <div className={classes.clubImageContainer}>
                    {currentlyReading && (
                      <>
                        <img
                          src={currentlyReading.coverImageURL}
                          alt={currentlyReading.title}
                          className={classes.clubImage}
                        />
                        <div className={classes.clubImageShade} />
                        {recommendation && (
                          <div
                            className={classes.recommendationCaptionContainer}
                          >
                            <MuiThemeProvider theme={whiteTheme}>
                              <Info height={24} color="primary" />
                            </MuiThemeProvider>
                            <Typography
                              variant="body2"
                              className={classes.recommendationCaptionText}
                            >
                              {recommendation.description}
                            </Typography>
                          </div>
                        )}
                        <div className={classes.imageTextContainer}>
                          <Typography
                            variant="h5"
                            className={classes.imageTitleText}
                          >
                            <Truncate lines={2} trimWhitespace={true}>
                              {currentlyReading.title}
                            </Truncate>
                          </Typography>
                          <Typography className={classes.imageText}>
                            {`${currentlyReading.author}${
                              year ? `, ${year}` : ''
                            }`}
                          </Typography>
                          <Typography className={classes.imageText}>
                            <Truncate lines={1} trimWhitespace={true}>
                              {currentlyReading.genres.join(', ')}
                            </Truncate>
                          </Typography>
                        </div>
                      </>
                    )}
                  </div>
                  <CardContent className={classes.cardContent}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      className={classes.clubTitle}
                    >
                      <Truncate lines={2} trimWhitespace={true}>
                        {club.name}
                      </Truncate>
                    </Typography>
                    <Typography color="textSecondary">
                      <Truncate lines={3} trimWhitespace={true}>
                        {club.bio}
                      </Truncate>
                    </Typography>
                    <div className={classes.clubAttributesContainer}>
                      <div className={classes.clubAttributesSubcontainer}>
                        {/* Member Count */}
                        <div
                          className={clsx(
                            classes.clubAttributesCell,
                            classes.topCell
                          )}
                        >
                          <div className={classes.attributeElement}>
                            <GenericGroupMemberAvatar />
                            <Typography
                              variant="body2"
                              className={classes.attributeLabel}
                            >
                              {`${club.memberCount} ${
                                club.maxMembers === UNLIMITED_CLUB_MEMBERS_VALUE
                                  ? ``
                                  : `(Max ${club.maxMembers})`
                              }`}
                            </Typography>
                          </div>
                        </div>
                        {/* Club Vibe */}
                        <div
                          className={clsx(
                            classes.clubAttributesCell,
                            classes.bottomCell
                          )}
                        >
                          {groupVibeAvatar && groupVibeLabel && (
                            <div className={classes.attributeElement}>
                              {groupVibeAvatar}
                              <Typography
                                variant="body2"
                                className={classes.attributeLabel}
                              >
                                {groupVibeLabel}
                              </Typography>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={classes.clubAttributesSubcontainer}>
                        {/* Start Date */}
                        <div
                          className={clsx(
                            classes.clubAttributesCell,
                            classes.topCell
                          )}
                        >
                          <div className={classes.attributeElement}>
                            <StartAvatar />
                            <Typography
                              variant="body2"
                              className={classes.attributeLabel}
                            >
                              {startMsg}
                            </Typography>
                          </div>
                        </div>
                        {/* Progress */}
                        <div className={classes.clubAttributesProgress}>
                          <MuiThemeProvider
                            theme={progress >= 1 ? successTheme : theme}
                          >
                            <Typography variant="caption" color="primary">
                              {`${Math.round(progress * 100)}% complete`}
                            </Typography>
                          </MuiThemeProvider>
                        </div>
                        {/* End Date */}
                        <div
                          className={clsx(
                            classes.clubAttributesCell,
                            classes.bottomCell
                          )}
                        >
                          <div className={classes.attributeElement}>
                            <EndAvatar />
                            <Typography
                              variant="body2"
                              className={classes.attributeLabel}
                            >
                              {endMsg}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardActions className={classes.cardActions}>
                    <div className={classes.creationInfoContainer}>
                      <Typography variant="caption" color="textSecondary">
                        <Truncate
                          lines={1}
                          trimWhitespace={true}
                          width={creationInfoContainerWidth}
                        >
                          {`Created on ${format(
                            new Date(club.createdAt),
                            'PP'
                          )}`}
                        </Truncate>
                      </Typography>
                      {club && club.ownerName && club.ownerName.length > 0 && (
                        <Typography variant="caption" color="textSecondary">
                          <Truncate
                            lines={1}
                            trimWhitespace={true}
                            width={creationInfoContainerWidth}
                          >
                            {`by ${club.ownerName}`}
                          </Truncate>
                        </Typography>
                      )}
                      <ReactResizeDetector
                        handleWidth
                        onResize={(w, h) => setCreationInfoContainerWidth(w)}
                      />
                    </div>
                    {(!quickJoin || !isLoggedIn) && (
                      <Button
                        className={classes.button}
                        color="primary"
                        variant="contained"
                        href={`/clubs/${club._id}`}
                      >
                        <Typography variant="button">VIEW CLUB</Typography>
                      </Button>
                    )}
                    {quickJoin && isLoggedIn && (
                      <MuiThemeProvider theme={isMember ? successTheme : theme}>
                        <div className={classes.actionButtonsContainer}>
                          <Button
                            style={{ marginRight: 8 }}
                            color="primary"
                            href={`/clubs/${club._id}`}
                            target="_blank"
                          >
                            <Typography variant="button">VIEW CLUB</Typography>
                          </Button>
                          <div className={classes.buttonWrapper}>
                            <Button
                              style={{ marginRight: 8 }}
                              color="primary"
                              variant="contained"
                              onClick={() =>
                                onChangeMembership(club, index, !isMember)
                              }
                              disabled={isChangingMembership}
                            >
                              <Typography
                                className={classes.joinButtonText}
                                variant="button"
                              >
                                {isMember ? 'JOINED' : 'JOIN'}
                              </Typography>
                            </Button>
                            {isChangingMembership && (
                              <CircularProgress
                                size={joinProgressIndicatorSize}
                                className={classes.joinProgressIndicator}
                              />
                            )}
                          </div>
                        </div>
                      </MuiThemeProvider>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            </LazyLoad>
          );
        })}
      </Grid>
      <CustomSnackbar {...snackbarProps} />
      <DiscordLoginModal
        onCloseLoginDialog={onCloseLoginDialog}
        open={loginModalShown}
      />
    </>
  );
}
