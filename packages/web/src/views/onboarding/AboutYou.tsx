import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  User,
  ShelfEntry,
  ReadingSpeed,
  GroupVibe,
  Services,
  Genre,
  Genres,
} from '@caravan/buddy-reading-types';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import purple from '@material-ui/core/colors/purple';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import AdapterLink from '../../components/AdapterLink';
import Header from '../../components/Header';
import { saveReadingPreferences } from '../../services/onboarding';
import { getAllGenres } from '../../services/genre';
import {
  readingSpeedIcons,
  readingSpeedLabels,
  readingSpeedSubtitles,
} from '../../components/reading-speed-avatars-icons-labels';

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: {
      main: '#7289da',
    },
  },
});

const useStyles = makeStyles(theme => ({
  formContainer: {
    paddingBottom: theme.spacing(4),
  },
  addButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    margin: theme.spacing(2),
  },
  sectionContainer: {
    marginTop: theme.spacing(4),
  },
  sectionHeader: {
    marginBottom: theme.spacing(1),
  },
  hero: {
    padding: theme.spacing(6, 0, 0),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroInfo: {
    padding: theme.spacing(6, 2, 2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    // margin: theme.spacing(1),
    // justifyContent: 'center',
  },
  gridList: {
    width: '100%',
    height: 470,
  },
  genreContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
}));

interface AboutYouProps {
  user: User | null;
  onContinue: (genres: string[], readingSpeed: string) => void;
  continuing: boolean;
}

export default function AboutYou(props: AboutYouProps) {
  const classes = useStyles();

  // useEffect(() => {
  //   const getGenres = async () => {
  //     const response = await getAllGenres();
  //     if (response.status >= 200 && response.status < 300) {
  //       const { data } = response;
  //       setGenres(data);
  //     }
  //   };
  //   getGenres();
  // }, []);

  return (
    <>
      <div className={classes.hero}>
        <Typography variant="h5">Welcome to</Typography>
        <div style={{ display: 'flex' }}>
          <Typography variant="h3">Caravan</Typography>
          <Typography variant="h3" color="primary">
            .
          </Typography>
        </div>
      </div>
      <div className={classes.heroInfo}>
        <Typography variant="subtitle1">
          To get started, let us know your reading preferences to help us find
          groups you'll love.
        </Typography>
      </div>
      <Container className={classes.formContainer} maxWidth="md">
        <Typography>Joker</Typography>
      </Container>
    </>
  );
}
