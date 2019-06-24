import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  User,
  ShelfEntry,
  ReadingSpeed,
  GroupVibe,
  Services,
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
import BackIcon from '@material-ui/icons/ArrowBackIos';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import AdapterLink from '../../components/AdapterLink';
import Header from '../../components/Header';
import { createClub } from '../../services/club';
import BookSearch from '../books/BookSearch';
import {
  readingSpeedIcons,
  readingSpeedLabels,
} from '../../components/reading-speed-avatars-icons-labels';
import {
  groupVibeIcons,
  groupVibeLabels,
} from '../../components/group-vibe-avatars-icons-labels';
import { getShelfFromGoogleBooks } from './functions/ClubFunctions';

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
      color="inherit"
      aria-label="Back"
      component={AdapterLink}
      to="/"
    >
      <BackIcon />
    </IconButton>
  );

  const centerComponent = <Typography variant="h6">Create a Group</Typography>;

  // const rightComponent = (
  //   <IconButton
  //     edge="start"
  //     color="inherit"
  //     aria-label="More"
  //     component={AdapterLink}
  //     to="/"
  //   >
  //     <ThreeDotsIcon />
  //   </IconButton>
  // );

  const [selectedGroupSize, setSelectedGroupSize] = React.useState<number>(4);
  const [selectedGroupSpeed, setSelectedGroupSpeed] = React.useState<
    ReadingSpeed
  >('moderate');
  const [selectedGroupVibe, setSelectedGroupVibe] = React.useState<GroupVibe>(
    'chill'
  );
  const [selectedGroupName, setSelectedGroupName] = React.useState('');
  const [selectedGroupBio, setSelectedGroupBio] = React.useState('');
  const [selectedBooks, setSelectedBooks] = React.useState<ShelfEntry[]>([]);
  const [bookToRead, setBookToRead] = React.useState<ShelfEntry | null>(null);
  const [privateClub, setPrivateClub] = React.useState(false);
  const [creatingClub, setCreatingClub] = React.useState(false);
  const [
    createdClub,
    setCreatedClub,
  ] = React.useState<Services.CreateClubResult | null>(null);

  const groupSizes: number[] = [2, 3, 4, 5, 6, 10, 20];
  const readingSpeeds: ReadingSpeed[] = ['fast', 'moderate', 'slow'];
  const groupVibes: GroupVibe[] = [
    'chill',
    'first-timers',
    'learning',
    'nerdy',
    'power',
  ];

  function onSubmitSelectedBooks(
    selectedBooks: ShelfEntry[],
    bookToRead: ShelfEntry | null
  ) {
    setSelectedBooks(selectedBooks);
    setBookToRead(bookToRead);
  }

  useEffect(() => {
    if (createdClub) {
      props.history.replace(`/clubs/${createdClub.club._id}`);
    }
  }, [createdClub, props.history]);

  async function createClubOnClick() {
    if (!bookToRead) {
      return;
    }
    const clubObj: any = {
      name: selectedGroupName,
      shelf: selectedBooks,
      bio: selectedGroupBio,
      maxMembers: selectedGroupSize,
      vibe: selectedGroupVibe,
      readingSpeed: selectedGroupSpeed,
      channelSource: 'discord',
      private: privateClub,
    };
    setCreatingClub(true);
    const createdClubRes = await createClub(clubObj);
    const { data } = createdClubRes;
    if (data) {
      setCreatedClub(data);
    }
  }

  let privateSwitchLabel = 'Anyone can find and join my club.';
  if (privateClub) {
    privateSwitchLabel = 'Only friends I share the link with can join my club.';
  }

  return (
    <>
      <Header leftComponent={leftComponent} centerComponent={centerComponent} />
      <Container className={classes.formContainer} maxWidth="md">
        <div className={classes.sectionContainer}>
          <Typography variant="subtitle1" className={classes.sectionHeader}>
            Who can join?
          </Typography>
          <Grid
            container
            spacing={0}
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid item xs>
              <div
                style={{
                  display: 'flex',
                  flexGrow: 1,
                  justifyContent: 'flex-end',
                }}
              >
                <Typography>Anyone</Typography>
              </div>
            </Grid>
            <Grid item>
              <div
                style={{
                  display: 'flex',
                  flexGrow: 1,
                  justifyContent: 'center',
                  marginLeft: 8,
                  marginRight: 8,
                }}
              >
                <Switch
                  checked={privateClub}
                  onChange={(e, checked) => setPrivateClub(checked)}
                  value="checked"
                  color="primary"
                />
              </div>
            </Grid>
            <Grid item xs>
              <div
                style={{
                  display: 'flex',
                  flexGrow: 1,
                  justifyContent: 'flex-start',
                }}
              >
                <Typography>Friends only</Typography>
              </div>
            </Grid>
          </Grid>
          <Typography align="center" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
            {privateSwitchLabel}
          </Typography>
        </div>
        <div className={classes.sectionContainer}>
          <TextField
            id="filled-name"
            label="Group Name"
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
        </div>
        <div className={classes.sectionContainer}>
          <Typography className={classes.sectionHeader} variant="subtitle1">
            What books would you like to read?
          </Typography>
          <BookSearch
            onSubmitBooks={onSubmitSelectedBooks}
            maxSelected={5}
            radioValue={bookToRead && bookToRead._id ? bookToRead._id : 'none'}
          />
        </div>
        <div className={classes.sectionContainer}>
          <Typography variant="subtitle1" className={classes.sectionHeader}>
            How many group members do you want?
          </Typography>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            {groupSizes.map(size => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Radio
                  checked={selectedGroupSize === size}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedGroupSize(size)
                  }
                  value={size.toString()}
                  color="primary"
                />
                <Typography>{size}</Typography>
              </div>
            ))}
          </div>
        </div>
        <div className={classes.sectionContainer}>
          <Typography variant="subtitle1" className={classes.sectionHeader}>
            How fast do you want the group to read?
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
                  checked={selectedGroupSpeed === speed}
                  onChange={() => setSelectedGroupSpeed(speed)}
                  value={speed}
                  color="primary"
                  style={{ marginLeft: 8 }}
                />
                <Typography style={{ marginLeft: 8 }}>
                  {readingSpeedLabels(speed)}
                </Typography>
              </div>
            ))}
          </div>
        </div>
        <div className={classes.sectionContainer}>
          <Typography variant="subtitle1" className={classes.sectionHeader}>
            What vibe do you want the group to have?
          </Typography>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {groupVibes.map(vibe => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {groupVibeIcons(vibe, 'icon')}
                <Radio
                  checked={selectedGroupVibe === vibe}
                  onChange={() => setSelectedGroupVibe(vibe)}
                  value={vibe}
                  color="primary"
                  style={{ marginLeft: 8 }}
                />
                <Typography style={{ marginLeft: 8 }}>
                  {groupVibeLabels(vibe)}
                </Typography>
              </div>
            ))}
          </div>
        </div>
        <div className={classes.sectionContainer}>
          <TextField
            id="outlined-multiline-static"
            label="Group Bio"
            multiline
            fullWidth
            rows="4"
            variant="outlined"
            inputProps={{ maxLength: 300 }}
            helperText="300 character limit"
            onChange={(
              e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
              >
            ) => setSelectedGroupBio(e.target.value)}
          />
        </div>
        <div className={classes.sectionContainer}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-end',
            }}
          >
            {!creatingClub && (
              <Button
                variant="contained"
                disabled={
                  selectedGroupBio === '' ||
                  selectedGroupName === '' ||
                  !bookToRead ||
                  selectedBooks.length === 0
                }
                onClick={createClubOnClick}
                color="primary"
              >
                CREATE
              </Button>
            )}
            {creatingClub && <CircularProgress />}
          </div>
        </div>
      </Container>
    </>
  );
}
