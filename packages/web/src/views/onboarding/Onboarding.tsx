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
import BackIcon from '@material-ui/icons/ArrowBackIos';
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

import ReadingPreferences from './ReadingPreferences';
import AboutYou from './AboutYou';
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

const useStyles = makeStyles(theme => ({}));

interface OnboardingRouteParams {
  id: string;
}

interface OnboardingProps extends RouteComponentProps<OnboardingRouteParams> {
  user: User | null;
}

export default function Onboarding(props: OnboardingProps) {
  const classes = useStyles();

  const centerComponent1 = (
    <Typography variant="h6">Reading Preferences</Typography>
  );

  const centerComponent2 = <Typography variant="h6">About You</Typography>;

  const leftComponent = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="Back"
      onClick={() => setCurrentPage(1)}
    >
      <BackIcon />
    </IconButton>
  );

  const [continuing, setContinuing] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(1);

  const [
    selectedReadingPreferences,
    setSelectedReadingPreferences,
  ] = React.useState<Services.ReadingPreferencesResult | null>(null);

  const readingSpeeds: ReadingSpeed[] = ['fast', 'moderate', 'slow'];

  const [selectedSpeed, setSelectedSpeed] = React.useState<ReadingSpeed>(
    'moderate'
  );

  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);

  function onGenreSelected(genre: string, selected: boolean) {
    if (selected) {
      let newGenres: string[];
      newGenres = [...selectedGenres, genre];
      setSelectedGenres(newGenres);
    } else {
      const updatedGenres = selectedGenres.filter(g => g !== genre);
      setSelectedGenres(updatedGenres);
    }
  }

  function onSetSelectedSpeed(speed: ReadingSpeed) {
    setSelectedSpeed(speed);
  }

  function continueToNextPage(genres: string[], readingSpeed: string) {
    if (genres.length < 1) {
      return;
    }
    const readingPreferencesObj = {
      genres: genres,
      readingSpeed: readingSpeed,
    };
    // setContinuing(true);
    // const savedReadingPreferencesRes = await saveReadingPreferences(
    //   readingPreferencesObj
    // );
    // const { data } = savedReadingPreferencesRes;
    // if (data) {
    //   setSelectedReadingPreferences(data);
    // }
    console.log(readingPreferencesObj);
    setCurrentPage(2);
  }

  return (
    <>
      {currentPage === 1 && (
        <>
          <Header centerComponent={centerComponent1} />
          <ReadingPreferences
            continuing={continuing}
            onContinue={continueToNextPage}
            user={props.user}
            selectedGenres={selectedGenres}
            onGenreSelected={onGenreSelected}
            selectedSpeed={selectedSpeed}
            onSetSelectedSpeed={onSetSelectedSpeed}
          />
        </>
      )}
      {currentPage === 2 && (
        <>
          <Header
            centerComponent={centerComponent2}
            leftComponent={leftComponent}
          />
          <AboutYou
            continuing={continuing}
            onContinue={continueToNextPage}
            user={props.user}
          />
        </>
      )}
    </>
  );
}
