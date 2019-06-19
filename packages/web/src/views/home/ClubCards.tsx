import React from 'react';
import { ClubWithCurrentlyReading } from '@caravan/buddy-reading-types';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/PersonOutline';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {
  groupVibeIcons,
  groupVibeLabels,
} from '../../components/group-vibe-avatars-icons-labels';
import {
  readingSpeedIcons,
  readingSpeedLabels,
} from '../../components/reading-speed-avatars-icons-labels';
import './ClubCards.css';

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
    height: '200px',
    flexGrow: 1,
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
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0px',
  },
  infoButton: {
    fontSize: '20px',
    color: '#7289da',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  joinButton: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginRight: 16,
    marginBottom: 10,
    color: 'white',
    backgroundColor: '#7289da',
  },
  clubImageContainer: {
    position: 'relative',
    'border-radius': '4px',
    'flex-grow': 1,
  },
  clubImage: {
    width: '100%',
    height: '194px',
    'object-fit': 'cover',
    filter: 'blur(2px)',
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
    'justify-content': 'flex-end',
    'align-items': 'flex-end',
    padding: 16,
  },
  imageText: {
    'font-size': '16px',
    width: '100%',
    'text-align': 'left',
    color: '#ffffff',
  },
  imageTitleText: {
    'font-size': '20px',
    width: '100%',
    'text-align': 'left',
    color: '#ffffff',
  },
}));

interface ClubCardsProps {
  clubsWCR: ClubWithCurrentlyReading[];
}

export default function ClubCards(props: ClubCardsProps) {
  const classes = useStyles();
  const { clubsWCR } = props;

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {clubsWCR.map(c => {
              const { club, currentlyReading } = c;
              let year;
              if (currentlyReading && currentlyReading.publishedDate) {
                year = new Date(
                  currentlyReading.publishedDate
                ).getUTCFullYear();
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
                            <Typography className={classes.imageTitleText}>
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
                      <Typography gutterBottom variant="h5" component="h2">
                        {club.name}
                      </Typography>
                      <div className={classes.iconRoot}>
                        <div className={classes.iconWithLabel}>
                          <PersonIcon />
                          <Typography
                            variant="subtitle1"
                            className={classes.iconLabel}
                          >
                            {`${club.members.length}/${club.maxMembers}`}
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
                      <Button className={classes.infoButton} size="small">
                        Info
                      </Button>
                      <Button
                        variant="contained"
                        className={classes.joinButton}
                        size="small"
                      >
                        Join
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
}
