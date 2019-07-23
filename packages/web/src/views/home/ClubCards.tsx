import React from 'react';
import Truncate from 'react-truncate';
import LazyLoad from 'react-lazyload';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import { User, ClubTransformed } from '@caravan/buddy-reading-types';
import {
  groupVibeIcons,
  groupVibeLabels,
} from '../../components/group-vibe-avatars-icons-labels';
import AdapterLink from '../../components/AdapterLink';
import format from 'date-fns/esm/format';
import GenericGroupMemberAvatar from '../../components/misc-avatars-icons-labels/avatars/GenericGroupMemberAvatar';
import StartAvatar from '../../components/misc-avatars-icons-labels/avatars/StartAvatar';
import { isAfter, addDays } from 'date-fns/esm';
import EndAvatar from '../../components/misc-avatars-icons-labels/avatars/EndAvatar';
import PlaceholderCard from '../../components/PlaceholderCard';
import { washedTheme } from '../../theme';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  cardGrid: {
    padding: `${theme.spacing(4)}px 16px ${theme.spacing(8)}px`,
  },
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
  imageText: {
    width: '100%',
    textAlign: 'left',
    color: '#ffffff',
  },
  imageTitleText: {
    width: '100%',
    textAlign: 'left',
    color: '#ffffff',
    fontWeight: 600,
  },
  progress: {
    margin: theme.spacing(2),
  },
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
    flexGrow: 1,
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
}));

interface ClubCardsProps {
  clubsTransformed: ClubTransformed[];
  user: User | null;
}

// Make this approximately the height of a standard ClubCard
const placeholderCardHeight = 525;
// The number of cards above and below the current to load
const lazyloadOffset = 8;

export default function ClubCards(props: ClubCardsProps) {
  const classes = useStyles();
  const { clubsTransformed } = props;

  const [loginModalShown, setLoginModalShown] = React.useState(false);

  const onCloseLoginDialog = () => {
    setLoginModalShown(false);
  };

  return (
    <main>
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {clubsTransformed.map(c => {
            const { club, currentlyReading, schedule, owner } = c;
            let year;
            if (currentlyReading && currentlyReading.publishedDate) {
              year = format(new Date(currentlyReading.publishedDate), 'yyyy');
            }
            let startMsg = 'Start: Not set';
            let endMsg = 'End: Not set';
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
                                {`${club.memberCount} (Max ${club.maxMembers})`}
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
                            <Typography variant="caption" color="primary">
                              34% complete
                            </Typography>
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
                      {/* <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={1}
                        style={{ marginTop: 16 }}
                      >
                        <Grid item xs={6}>
                          <div className={classes.attributeElement}>
                            <GenericGroupMemberAvatar />
                            <Typography
                              variant="body2"
                              className={classes.attributeLabel}
                            >
                              {`${club.memberCount} (Max ${club.maxMembers})`}
                            </Typography>
                          </div>
                        </Grid>
                        <Grid item xs={6}>
                          <div className={classes.attributeElement}>
                            <StartAvatar />
                            <Typography
                              variant="body2"
                              className={classes.attributeLabel}
                            >
                              {startMsg}
                            </Typography>
                          </div>
                        </Grid>
                        <Grid item xs={6} style={{ marginTop: 16 }}>

                        </Grid>
                        <Grid item xs={6} style={{ marginTop: 16 }}>
                          <div className={classes.attributeElement}>
                            <EndAvatar />
                            <Typography
                              variant="body2"
                              className={classes.attributeLabel}
                            >
                              {endMsg}
                            </Typography>
                          </div>
                        </Grid>
                      </Grid> */}
                    </CardContent>
                    <CardActions className={classes.cardActions}>
                      <div className={classes.creationInfoContainer}>
                        <Typography variant="caption" color="textSecondary">
                          {`Created on ${format(
                            new Date(club.createdAt),
                            'PP'
                          )}`}
                        </Typography>
                        {owner && owner.name && owner.name.length > 0 && (
                          <Typography variant="caption" color="textSecondary">
                            {/* Truncate doesn't work as advertised, so we set an exact width here. */}
                            <Truncate
                              lines={1}
                              trimWhitespace={true}
                              width={196}
                            >
                              {`by ${owner.name}`}
                            </Truncate>
                          </Typography>
                        )}
                      </div>
                      <Button
                        className={classes.button}
                        color="primary"
                        variant="contained"
                        component={AdapterLink}
                        to={`/clubs/${club._id}`}
                      >
                        <Typography variant="button">VIEW CLUB</Typography>
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </LazyLoad>
            );
          })}
        </Grid>
        <DiscordLoginModal
          onCloseLoginDialog={onCloseLoginDialog}
          open={loginModalShown}
        />
      </Container>
    </main>
  );
}
