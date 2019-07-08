import React, { useEffect } from 'react';
import {
  User,
  ReadingSpeed,
  Services,
  UserSelectedGenre,
} from '@caravan/buddy-reading-types';
import { Fab } from '@material-ui/core';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import ForwardIcon from '@material-ui/icons/ArrowForwardIos';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import purple from '@material-ui/core/colors/purple';
import Grid from '@material-ui/core/Grid';
import { getAllGenres } from '../../services/genre';
import {
  readingSpeedIcons,
  readingSpeedLabels,
} from '../../components/reading-speed-avatars-icons-labels';
import ListElementAvatar from '../../components/ListElementAvatar';
import GenreChip from '../../components/GenreChip';
import logo from '../../resources/logo.svg';

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

interface ReadingPreferencesProps {
  user: User | null;
  onContinue: () => void;
  continuing: boolean;
  selectedGenres: UserSelectedGenre[];
  onGenreSelected: (
    genreKey: string,
    genreName: string,
    selected: boolean
  ) => void;
  selectedSpeed: string;
  onSetSelectedSpeed: (speed: ReadingSpeed) => void;
}

export default function ReadingPreferences(props: ReadingPreferencesProps) {
  const classes = useStyles();

  const [genreDoc, setGenres] = React.useState<Services.GetGenres | null>(null);

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
          <img
            src={logo}
            alt="Caravan logo"
            style={{ height: 50, objectFit: 'contain' }}
          />
        </div>
      </div>

      <div className={classes.heroInfo}>
        <Typography variant="h6">
          To get started, let us know your reading preferences to help us find
          clubs you'll love.
        </Typography>
      </div>
      <Container className={classes.formContainer} maxWidth="md">
        <div className={classes.sectionContainer}>
          <Typography className={classes.sectionHeader}>
            How fast do you normally read?
          </Typography>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {readingSpeeds.map(speed => (
              <ListElementAvatar
                key={speed}
                primaryElement={
                  <Radio
                    checked={props.selectedSpeed === speed}
                    onChange={() => props.onSetSelectedSpeed(speed)}
                    value={speed}
                    name={`radio-button-${speed}`}
                    color="primary"
                  />
                }
                avatarElement={readingSpeedIcons(speed, 'avatar')}
                primaryText={readingSpeedLabels(speed)}
                secondaryText={readingSpeedLabels(speed, 'description')}
              />
            ))}
          </div>
        </div>

        <div className={classes.sectionContainer}>
          <Typography className={classes.sectionHeader}>
            Select some genres you're interested in reading.
          </Typography>
          <div>
            {genreDoc &&
              genreDoc.mainGenres.map((genreKey: string) => {
                const genreSelected = props.selectedGenres
                  .map(g => g.key)
                  .includes(genreKey);
                return (
                  <GenreChip
                    key={genreKey}
                    genreKey={genreKey}
                    name={genreDoc.genres[genreKey].name}
                    active={genreSelected}
                    clickable={true}
                    onClick={() =>
                      props.onGenreSelected(
                        genreKey,
                        genreDoc.genres[genreKey].name,
                        !genreSelected
                      )
                    }
                  />
                );
              })}
          </div>
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
                onClick={() => props.onContinue()}
                color="secondary"
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
