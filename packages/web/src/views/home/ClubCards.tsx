import React from 'react';
import { ClubWithCurrentlyReading } from './Home';
import { CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/PersonOutline';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import { User } from '@caravan/buddy-reading-types';
import {
  groupVibeIcons,
  groupVibeLabels,
} from '../../components/group-vibe-avatars-icons-labels';
import {
  readingSpeedIcons,
  readingSpeedLabels,
} from '../../components/reading-speed-avatars-icons-labels';
import AdapterLink from '../../components/AdapterLink';

const useStyles = makeStyles(theme => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
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
    marginBottom: 10,
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
    'border-radius': '4px',
    height: '194px',
    width: '100%',
  },
  clubImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    'object-fit': 'cover',
    'object-position': '50% 50%',
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
    'text-align': 'left',
    color: '#ffffff',
  },
  imageTitleText: {
    width: '100%',
    'text-align': 'left',
    color: '#ffffff',
    fontWeight: 600,
  },
  progress: {
    margin: theme.spacing(2),
  },
  clubTitle: {},
}));

interface ClubCardsProps {
  clubsWCR: ClubWithCurrentlyReading[];
  user: User | null;
}

export default function ClubCards(props: ClubCardsProps) {
  const classes = useStyles();
  const { clubsWCR } = props;

  const [loginModalShown, setLoginModalShown] = React.useState(false);
  const [joinClubLoadingId, setJoinClubLoadingId] = React.useState('');

  const onCloseLoginDialog = () => {
    setLoginModalShown(false);
  };

  return (
    <main>
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {clubsWCR.map(c => {
            const { club, currentlyReading } = c;
            let year;
            if (currentlyReading && currentlyReading.publishedDate) {
              year = new Date(currentlyReading.publishedDate).getUTCFullYear();
            }
            return (
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
                            {currentlyReading.title}
                          </Typography>
                          <Typography className={classes.imageText}>
                            {currentlyReading.author}
                            {year && `, ${year}`}
                          </Typography>
                          <Typography className={classes.imageText}>
                            {currentlyReading.genres.join(', ')}
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
                      {club.name}
                    </Typography>
                    <div className={classes.iconRoot}>
                      <div className={classes.iconWithLabel}>
                        <PersonIcon />
                        <Typography
                          variant="subtitle1"
                          className={classes.iconLabel}
                        >
                          {`${club.memberCount}/${club.maxMembers}`}
                        </Typography>
                      </div>
                      {club.vibe && (
                        <div className={classes.iconWithLabel}>
                          {groupVibeIcons(club.vibe, 'icon')}
                          <Typography
                            variant="subtitle1"
                            className={classes.iconLabel}
                          >
                            {groupVibeLabels(club.vibe)}
                          </Typography>
                        </div>
                      )}
                      {club.readingSpeed && (
                        <div className={classes.iconWithLabel}>
                          {readingSpeedIcons(club.readingSpeed, 'icon')}
                          <Typography
                            variant="subtitle1"
                            className={classes.iconLabel}
                          >
                            {readingSpeedLabels(club.readingSpeed)}
                          </Typography>
                        </div>
                      )}
                    </div>
                    <Typography>{club.bio}</Typography>
                  </CardContent>
                  <CardActions className={classes.cardActions}>
                    <Button
                      className={classes.button}
                      color="primary"
                      variant="contained"
                      component={AdapterLink}
                      to={`/clubs/${club._id}`}
                    >
                      <Typography variant="button">INFO</Typography>
                    </Button>
                    {/* <Button
                        variant="contained"
                        className={classes.button}
                        color="primary"
                        onClick={() =>
                          !props.user
                            ? setLoginModalShown(true)
                            : setJoinClubLoadingId(club._id)
                        }
                        disabled={club.memberCount >= club.maxMembers}
                      >
                        JOIN
                      </Button> */}
                    {joinClubLoadingId === club._id && (
                      <CircularProgress className={classes.progress} />
                    )}
                  </CardActions>
                </Card>
              </Grid>
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
