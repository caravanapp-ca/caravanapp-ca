import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { User, GoogleBooks, ShelfEntry } from '@caravan/buddy-reading-types';
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
  paper: {
    height: 160,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
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
  searchContainer: {
    padding: 0,
    marginBottom: 30,
    position: 'relative',
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    borderRadius: 10,
  },
  input: {
    marginLeft: 8,
    flex: 1,
    paddingRight: 10,
  },
  iconButton: {
    padding: 10,
  },
  searchResultsList: {
    width: '100%',
    borderRadius: 10,
    position: 'absolute',
    backgroundColor: 'white',
    top: '50px',
    left: 0,
    zIndex: 1,
  },
  searchResult: {
    padding: 5,
    marginTop: 0,
    marginBottom: 0,
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

  const [
    searchResults,
    setSearchResults,
  ] = React.useState<GoogleBooks.Books | null>(null);

  const [state, setState] = React.useState({
    checked: false,
  });

  const handlePrivacyChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [name]: event.target.checked });
  };

  const [selectedGroupSizeValue, setSelectedGroupSizeValue] = React.useState(
    '4'
  );

  const [selectedGroupSpeedValue, setSelectedGroupSpeedValue] = React.useState(
    'Moderate'
  );

  const [selectedGroupVibeValue, setSelectedGroupVibeValue] = React.useState(
    'Chill'
  );

  const [selectedGroupNameValue, setSelectedGroupNameValue] = React.useState(
    ''
  );

  const [selectedGroupBio, setSelectedGroupBio] = React.useState('');

  const [bookSearchQuery, setBookSearchQuery] = React.useState('');

  const [selectedBooks, setSelectedBooks] = React.useState<GoogleBooks.Item[]>(
    []
  );

  const [firstBookId, setFirstBookId] = React.useState('');

  const [searchHidden, setSearchHidden] = React.useState(false);

  useEffect(() => {
    if (selectedBooks.find(b => b.id !== firstBookId)) {
      setFirstBookId(selectedBooks.length > 0 ? selectedBooks[0].id : '');
    }
  }, [firstBookId, selectedBooks]);

  useEffect(() => {
    if (!bookSearchQuery || bookSearchQuery.length === 0) {
      setSearchHidden(true);
      setSearchResults(null);
    }
  }, [bookSearchQuery]);

  async function bookSearch(query: string) {
    if (query) {
      const results = await searchGoogleBooks(query);
      setSearchHidden(false);
      setSearchResults(results);
    }
    return null;
  }

  function handleOnKeyDown(e: React.KeyboardEvent<any>) {
    if (e.key == 'Enter') {
      bookSearch(bookSearchQuery);
    }
  }

  // TODO send method to book search card via props that allows displayed books to be added to selected list
  async function onAddBook(book: GoogleBooks.Item) {
    const newBooks = [...selectedBooks, book];
    setSelectedBooks(newBooks);
    setBookSearchQuery('');
  }

  async function onDeleteSelectedBook(book: GoogleBooks.Item) {
    const updatedBooks = selectedBooks.filter(
      selected => selected.id != book.id
    );
    setSelectedBooks(updatedBooks);
  }

  async function onSelectFirstBook(id: string) {
    setFirstBookId(id);
    getShelf(selectedBooks);
  }

  function getShelf(books: GoogleBooks.Item[]) {
    // const result = selectedBooks.map(book => {
    //   const res: ShelfEntry = {
    //     readingState: 'current',
    //     title: book.volumeInfo.title,
    //     genres: ['fantasy'],
    //   };
    //   return res;
    // });
  }

  function createClubOnClick() {
    getShelf(selectedBooks);
    const clubObj = {
      name: selectedGroupNameValue,
      ownerId: 'SOME_USER_ID',
      bio: selectedGroupBio,
      maxMembers: selectedGroupSizeValue,
      vibe: selectedGroupVibeValue,
      readingSpeed: selectedGroupSpeedValue,
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
            ) => setSelectedGroupNameValue(e.target.value)}
          />
          <Typography
            style={{ marginBottom: 10, fontSize: 16, color: '#8B8B8B' }}
            variant="subtitle1"
          >
            What books would you like to read?
          </Typography>

          <Container className={classes.searchContainer} maxWidth="md">
            <Paper elevation={2} className={classes.root}>
              <IconButton
                className={classes.iconButton}
                aria-label="Menu"
                onClick={() => bookSearch(bookSearchQuery)}
              >
                <SearchIcon />
              </IconButton>
              <InputBase
                className={classes.input}
                placeholder="Add a Book"
                fullWidth
                value={bookSearchQuery}
                inputProps={{ 'aria-label': 'Add a Book' }}
                onChange={e => setBookSearchQuery(e.target.value)}
                onKeyDown={handleOnKeyDown}
              />
            </Paper>
            {searchResults && !searchHidden && (
              <SearchResultCards
                searchResultObject={searchResults.items}
                onSelected={onAddBook}
              />
            )}
          </Container>
          {selectedBooks.length > 0 && (
            <SelectedBookCards
              selectedBooks={selectedBooks}
              firstBookId={firstBookId}
              onDeleted={onDeleteSelectedBook}
              onSelectFirstBook={onSelectFirstBook}
            />
          )}

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
                  checked={selectedGroupSizeValue === '2'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupSizeValue(event.target.value)
                  }
                  value="2"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': '2' }}
                />
                <Radio
                  checked={selectedGroupSizeValue === '3'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupSizeValue(event.target.value)
                  }
                  value="3"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': '3' }}
                />
                <Radio
                  checked={selectedGroupSizeValue === '4'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupSizeValue(event.target.value)
                  }
                  value="4"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': '4' }}
                />
                <Radio
                  checked={selectedGroupSizeValue === '5'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupSizeValue(event.target.value)
                  }
                  value="5"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': '5' }}
                />
                <Radio
                  checked={selectedGroupSizeValue === '6'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupSizeValue(event.target.value)
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
                  checked={selectedGroupSpeedValue === 'Slow'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupSpeedValue(event.target.value)
                  }
                  value="Slow"
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
                  checked={selectedGroupSpeedValue === 'Moderate'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupSpeedValue(event.target.value)
                  }
                  value="Moderate"
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
                  checked={selectedGroupSpeedValue === 'Fast'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupSpeedValue(event.target.value)
                  }
                  value="Fast"
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
                  checked={selectedGroupVibeValue === 'Chill'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupVibeValue(event.target.value)
                  }
                  value="Chill"
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
                  checked={selectedGroupVibeValue === 'Nerdy'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupVibeValue(event.target.value)
                  }
                  value="Nerdy"
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
                  checked={selectedGroupVibeValue === 'Power'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupVibeValue(event.target.value)
                  }
                  value="Power"
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
                  checked={selectedGroupVibeValue === 'FirstTimer'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupVibeValue(event.target.value)
                  }
                  value="FirstTimer"
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
                  checked={selectedGroupVibeValue === 'Learning'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupVibeValue(event.target.value)
                  }
                  value="Learning"
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
                    checked={state.checked}
                    onChange={handlePrivacyChange('checked')}
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
                selectedGroupNameValue === '' ||
                firstBookId === '' ||
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
