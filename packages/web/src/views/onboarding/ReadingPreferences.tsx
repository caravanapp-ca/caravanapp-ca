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
import { Fab } from '@material-ui/core';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import ForwardIcon from '@material-ui/icons/ArrowForwardIos';
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
    padding: theme.spacing(5, 0, 0),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroInfo: {
    padding: theme.spacing(5, 2, 2),
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

interface ReadingPreferencesRouteParams {
  id: string;
}

interface ReadingPreferencesProps {
  user: User | null;
  onContinue: (genres: string[], readingSpeed: string) => void;
  continuing: boolean;
  selectedGenres: string[];
  onGenreSelected: (genre: string, selected: boolean) => void;
  selectedSpeed: string;
  onSetSelectedSpeed: (speed: ReadingSpeed) => void;
}

export default function ReadingPreferences(props: ReadingPreferencesProps) {
  const classes = useStyles();

  const centerComponent = (
    <Typography variant="h6">Reading Preferences</Typography>
  );

  const [genreDoc, setGenres] = React.useState<Services.GetGenres | null>(null);

  const [
    selectedReadingPreferences,
    setSelectedReadingPreferences,
  ] = React.useState<Services.ReadingPreferencesResult | null>(null);

  const readingSpeeds: ReadingSpeed[] = ['fast', 'moderate', 'slow'];

  useEffect(() => {
    const getGenres = async () => {
      const response = await getAllGenres();
      if (response.status >= 200 && response.status < 300) {
        const { data } = response;
        setGenres(data);
      }
    };
    getGenres();
  }, []);

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
        <Typography variant="h6">
          To get started, let us know your reading preferences to help us find
          groups you'll love.
        </Typography>
      </div>
      <Container className={classes.formContainer} maxWidth="md">
        <div className={classes.sectionContainer}>
          <Typography variant="subtitle1" className={classes.sectionHeader}>
            How fast do you normally read?
          </Typography>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {readingSpeeds.map(speed => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {readingSpeedIcons(speed, 'icon')}
                <Radio
                  checked={props.selectedSpeed === speed}
                  onChange={() => props.onSetSelectedSpeed(speed)}
                  value={speed}
                  color="primary"
                  style={{ marginLeft: 8 }}
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    style={{
                      marginLeft: 8,
                      fontWeight: 'bold',
                      marginRight: 8,
                    }}
                    variant="h6"
                  >
                    {readingSpeedLabels(speed)}{' '}
                  </Typography>
                  <Typography variant="subtitle2">
                    {readingSpeedSubtitles(speed)}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={classes.sectionContainer}>
          <Typography className={classes.sectionHeader} variant="subtitle1">
            Select some genres you're interested in reading.
          </Typography>
          {/* <div className={classes.genreContainer}> */}
          <Grid container spacing={3}>
            {genreDoc &&
              genreDoc.mainGenres.map((genreKey: string) => {
                const genreSelected = props.selectedGenres.includes(genreKey);
                return (
                  <Grid item lg={3} md={4} xs={6} key={genreKey}>
                    <Button
                      className={classes.button}
                      color={genreSelected ? 'primary' : 'default'}
                      variant="contained"
                      onClick={() =>
                        props.onGenreSelected(genreKey, !genreSelected)
                      }
                    >
                      {genreDoc.genres[genreKey].name}
                    </Button>
                  </Grid>
                );
              })}
          </Grid>
        </div>

        <div className={classes.sectionContainer}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-end',
            }}
          >
            {!props.continuing && (
              <Fab
                disabled={props.selectedGenres.length === 0}
                onClick={() =>
                  props.onContinue(props.selectedGenres, props.selectedSpeed)
                }
                color="primary"
              >
                <ForwardIcon />
              </Fab>
            )}
            {props.continuing && <CircularProgress />}
          </div>
        </div>
      </Container>
    </>
  );
}
