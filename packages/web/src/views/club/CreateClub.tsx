import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  User,
  GoogleBooks,
  ShelfEntry,
  FilterAutoMongoKeys,
  Club,
  ReadingSpeed,
  GroupVibe,
} from '@caravan/buddy-reading-types';
import {
  makeStyles,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import purple from '@material-ui/core/colors/purple';
import WalkIcon from '@material-ui/icons/DirectionsWalk';
import CarIcon from '@material-ui/icons/DirectionsCar';
import BikeIcon from '@material-ui/icons/DirectionsBike';
import ChillIcon from '@material-ui/icons/Toys';
import NerdyIcon from '@material-ui/icons/VideogameAsset';
import LearningIcon from '@material-ui/icons/School';
import FirstTimerIcon from '@material-ui/icons/Cake';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import ThreeDotsIcon from '@material-ui/icons/MoreVert';
import PowerIcon from '@material-ui/icons/FlashOn';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import AdapterLink from '../../components/AdapterLink';
import Header from '../../components/Header';
import SearchResultCards from '../books/SearchResultCards';
import SelectedBookCards from '../books/SelectedBookCards';
import { createClub } from '../../services/club';
import { searchGoogleBooks } from '../../services/book';
import { RSA_NO_PADDING } from 'constants';
import BookSearch from '../books/BookSearch';

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
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
  },
  addButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginRight: theme.spacing(2),
  },
  headerTitle: {
    flexGrow: 1,
    fontWeight: 'bold',
  },
  moreButton: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(0),
  },
  createButtonSection: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0px',
  },
  createButton: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginRight: 16,
    marginBottom: 10,
    color: 'white',
    backgroundColor: '#7289da',
  },
}));

interface CreateClubRouteParams {
  id: string;
}

interface CreateClubProps extends RouteComponentProps<CreateClubRouteParams> {
  user: User | null;
}

export default function CreateClub(props: CreateClubProps) {
  const classes = useStyles();

  const leftComponent = (
    <IconButton
      edge="start"
      className={classes.backButton}
      color="inherit"
      aria-label="Back"
      component={AdapterLink}
      to="/"
    >
      <BackIcon />
    </IconButton>
  );

  const centerComponent = (
    <Typography variant="h6" className={classes.headerTitle}>
      Create a Group
    </Typography>
  );

  const rightComponent = (
    <IconButton
      edge="start"
      className={classes.moreButton}
      color="inherit"
      aria-label="More"
      component={AdapterLink}
      to="/"
    >
      <ThreeDotsIcon />
    </IconButton>
  );

  const [selectedGroupSize, setSelectedGroupSize] = React.useState<number>(4);

  const [selectedGroupSpeed, setSelectedGroupSpeed] = React.useState<
    ReadingSpeed
  >('moderate');

  const [selectedGroupVibe, setSelectedGroupVibe] = React.useState<GroupVibe>(
    'chill'
  );

  const [selectedGroupName, setSelectedGroupName] = React.useState('');

  const [selectedGroupBio, setSelectedGroupBio] = React.useState('');

  const [selectedBooks, setSelectedBooks] = React.useState<GoogleBooks.Item[]>(
    []
  );

  const [bookToRead, setBookToRead] = React.useState<GoogleBooks.Item | null>(
    null
  );

  const [privateClub, setPrivateClub] = React.useState(false);

  function onSubmitSelectedBooks(
    selectedBooks: GoogleBooks.Item[],
    bookToRead: GoogleBooks.Item
  ) {
    setSelectedBooks(selectedBooks);
    setBookToRead(bookToRead);
  }

  function getShelf() {
    const result = selectedBooks.map(book => {
      let readingState = 'notStarted';
      if (bookToRead && book.id === bookToRead.id) {
        readingState = 'current';
      }
      const res: FilterAutoMongoKeys<ShelfEntry> = {
        readingState: readingState,
        title: book.volumeInfo.title,
        genres: book.volumeInfo.categories,
        author: book.volumeInfo.authors.join(', '),
        isbn:
          'industryIdentifiers' in book.volumeInfo
            ? book.volumeInfo.industryIdentifiers[0].identifier
            : null,
        publishedDate:
          'publishedDate' in book.volumeInfo
            ? book.volumeInfo.publishedDate
            : null,
        coverImageURL:
          'imageLinks' in book.volumeInfo
            ? book.volumeInfo.imageLinks.thumbnail
            : null,
      };
      return res;
    });
    return result;
  }

  function createClubOnClick() {
    const shelf = getShelf() as ShelfEntry[];
    const clubObj: any = {
      name: selectedGroupName,
      shelf,
      bio: selectedGroupBio,
      maxMembers: selectedGroupSize,
      vibe: selectedGroupVibe,
      readingSpeed: selectedGroupSpeed,
      channelSource: 'discord',
      private: privateClub,
    };
    createClub(clubObj);
    console.log(clubObj.name);
  }

  const AntSwitch = withStyles(theme => ({
    root: {
      width: 28,
      height: 16,
      padding: 0,
      display: 'flex',
    },
    switchBase: {
      padding: 2,
      color: theme.palette.grey[500],
      '&$checked': {
        transform: 'translateX(12px)',
        color: theme.palette.common.white,
        '& + $track': {
          opacity: 1,
          backgroundColor: '#7289da',
          borderColor: '#7289da',
        },
      },
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: 'none',
    },
    track: {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: theme.palette.common.white,
    },
    checked: {},
  }))(Switch);

  return (
    <React.Fragment>
      <CssBaseline />
      <Header
        leftComponent={leftComponent}
        centerComponent={centerComponent}
        rightComponent={rightComponent}
      />
      <main>
        <Container className={classes.formContainer} maxWidth="md">
          <TextField
            id="filled-name"
            label="Group Name"
            style={{ marginBottom: 20, marginTop: 40 }}
            helperText="50 character limit"
            variant="outlined"
            fullWidth
            inputProps={{ maxLength: 50 }}
            onChange={(
              e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
              >
            ) => setSelectedGroupName(e.target.value)}
          />
          <Typography
            style={{ marginBottom: 10, fontSize: 16, color: '#8B8B8B' }}
            variant="subtitle1"
          >
            What books would you like to read?
          </Typography>
          <BookSearch onSubmitBooks={onSubmitSelectedBooks} maxSelected={5} />
          <Typography
            style={{ marginBottom: 10, fontSize: 16, color: '#8B8B8B' }}
            variant="subtitle1"
            component="h2"
          >
            How many group members do you want?
          </Typography>
          <div style={{ marginBottom: 20 }}>
            <MuiThemeProvider theme={theme}>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Radio
                  checked={selectedGroupSize === 2}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupSize(Number.parseInt(event.target.value))
                  }
                  value="2"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': '2' }}
                />
                <Radio
                  checked={selectedGroupSize === 3}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupSize(Number.parseInt(event.target.value))
                  }
                  value="3"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': '3' }}
                />
                <Radio
                  checked={selectedGroupSize === 4}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupSize(Number.parseInt(event.target.value))
                  }
                  value="4"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': '4' }}
                />
                <Radio
                  checked={selectedGroupSize === 5}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupSize(Number.parseInt(event.target.value))
                  }
                  value="5"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': '5' }}
                />
                <Radio
                  checked={selectedGroupSize === 6}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupSize(Number.parseInt(event.target.value))
                  }
                  value="6"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': '6' }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  marginBottom: 20,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  color: '#4B4B4B',
                }}
              >
                <Typography variant="h5" component="h2">
                  2
                </Typography>
                <Typography variant="h5" component="h2">
                  3
                </Typography>
                <Typography variant="h5" component="h2">
                  4
                </Typography>
                <Typography variant="h5" component="h2">
                  5
                </Typography>
                <Typography variant="h5" component="h2">
                  6
                </Typography>
              </div>
            </MuiThemeProvider>
          </div>

          <Typography
            style={{ marginBottom: 30, fontSize: 16, color: '#8B8B8B' }}
            variant="subtitle1"
            component="h2"
          >
            How fast do you want the group to read?
          </Typography>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '80%',
              marginBottom: 30,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Radio
                  checked={selectedGroupSpeed === 'slow'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupSpeed(event.target.value as ReadingSpeed)
                  }
                  value="slow"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'Slow' }}
                />
                <Typography
                  style={{ marginLeft: 10, color: '#4B4B4B' }}
                  variant="h5"
                  component="h2"
                >
                  Slow
                </Typography>
              </div>
              <div>
                <WalkIcon style={{ fontSize: 50, color: '#4B4B4B' }} />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Radio
                  checked={selectedGroupSpeed === 'moderate'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupSpeed(event.target.value as ReadingSpeed)
                  }
                  value="moderate"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'Moderate' }}
                />
                <Typography
                  style={{ marginLeft: 10, color: '#4B4B4B' }}
                  variant="h5"
                  component="h2"
                >
                  Moderate
                </Typography>
              </div>
              <div>
                <BikeIcon style={{ fontSize: 50, color: '#4B4B4B' }} />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Radio
                  checked={selectedGroupSpeed === 'fast'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupSpeed(event.target.value as ReadingSpeed)
                  }
                  value="fast"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'Fast' }}
                />
                <Typography
                  style={{ marginLeft: 10, color: '#4B4B4B' }}
                  variant="h5"
                  component="h2"
                >
                  Fast
                </Typography>
              </div>
              <div>
                <CarIcon style={{ fontSize: 50, color: '#4B4B4B' }} />
              </div>
            </div>
          </div>

          <Typography
            style={{ marginBottom: 30, fontSize: 16, color: '#8B8B8B' }}
            variant="subtitle1"
            component="h2"
          >
            What vibe do you want the group to have?
          </Typography>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '80%',
              marginBottom: 30,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Radio
                  checked={selectedGroupVibe === 'chill'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupVibe(event.target.value as GroupVibe)
                  }
                  value="chill"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'Chill' }}
                />
                <Typography
                  style={{ marginLeft: 10, color: '#4B4B4B' }}
                  variant="h5"
                  component="h2"
                >
                  Chill
                </Typography>
              </div>
              <div>
                <ChillIcon style={{ fontSize: 50, color: '#4B4B4B' }} />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Radio
                  checked={selectedGroupVibe === 'nerdy'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupVibe(event.target.value as GroupVibe)
                  }
                  value="nerdy"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'Nerdy' }}
                />
                <Typography
                  style={{ marginLeft: 10, color: '#4B4B4B' }}
                  variant="h5"
                  component="h2"
                >
                  Nerdy
                </Typography>
              </div>
              <div>
                <NerdyIcon style={{ fontSize: 50, color: '#4B4B4B' }} />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Radio
                  checked={selectedGroupVibe === 'power'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupVibe(event.target.value as GroupVibe)
                  }
                  value="power"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'Power' }}
                />
                <Typography
                  style={{ marginLeft: 10, color: '#4B4B4B' }}
                  variant="h5"
                  component="h2"
                >
                  Power
                </Typography>
              </div>
              <div>
                <PowerIcon style={{ fontSize: 50, color: '#4B4B4B' }} />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Radio
                  checked={selectedGroupVibe === 'first-timers'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupVibe(event.target.value as GroupVibe)
                  }
                  value="first-timers"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'FirstTimer' }}
                />
                <Typography
                  style={{ marginLeft: 10, color: '#4B4B4B' }}
                  variant="h5"
                  component="h2"
                >
                  First-timers
                </Typography>
              </div>
              <div>
                <FirstTimerIcon style={{ fontSize: 50, color: '#4B4B4B' }} />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Radio
                  checked={selectedGroupVibe === 'learning'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupVibe(event.target.value as GroupVibe)
                  }
                  value="learning"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'Learning' }}
                />
                <Typography
                  style={{ marginLeft: 10, color: '#4B4B4B' }}
                  variant="h5"
                  component="h2"
                >
                  Learning
                </Typography>
              </div>
              <div>
                <LearningIcon style={{ fontSize: 50, color: '#4B4B4B' }} />
              </div>
            </div>
          </div>

          <TextField
            id="multiline-full-width"
            style={{ marginBottom: 20, width: '100%' }}
            placeholder="Group Bio"
            helperText="300 character limit"
            variant="outlined"
            onChange={(
              e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
              >
            ) => setSelectedGroupBio(e.target.value)}
            multiline
            rows="4"
            inputProps={{ maxLength: 300 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Typography
            style={{ marginBottom: 20, fontSize: 16, color: '#8B8B8B' }}
            variant="subtitle1"
          >
            Is your group public or private?
          </Typography>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              marginBottom: '30px',
            }}
          >
            <Typography component="div">
              <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item style={{ fontSize: 24, color: '#4B4B4B' }}>
                  Public
                </Grid>
                <Grid item>
                  <AntSwitch
                    checked={privateClub}
                    onChange={(e, checked) => setPrivateClub(checked)}
                    value="checked"
                  />
                </Grid>
                <Grid item style={{ fontSize: 24, color: '#4B4B4B' }}>
                  Private
                </Grid>
              </Grid>
            </Typography>
          </div>
          <div className={classes.createButtonSection}>
            <Button
              variant="contained"
              disabled={
                selectedGroupBio === '' ||
                selectedGroupName === '' ||
                !bookToRead ||
                selectedBooks.length === 0
              }
              className={classes.createButton}
              size="small"
              onClick={createClubOnClick}
            >
              Create
            </Button>
          </div>
        </Container>
      </main>
    </React.Fragment>
  );
}
