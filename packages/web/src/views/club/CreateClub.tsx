import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  User,
  ShelfEntry,
  ReadingSpeed,
  GroupVibe,
  Services,
  FilterAutoMongoKeys,
  SelectedGenre,
  UninitClubShelfType,
} from '@caravan/buddy-reading-types';
import {
  useMediaQuery,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Radio,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import { createClub } from '../../services/club';
import AdapterLink from '../../components/AdapterLink';
import Header from '../../components/Header';
import BookSearch from '../books/BookSearch';
import {
  readingSpeedIcons,
  readingSpeedLabels,
} from '../../components/reading-speed-avatars-icons-labels';
import {
  groupVibeIcons,
  groupVibeLabels,
} from '../../components/group-vibe-avatars-icons-labels';
import HeaderTitle from '../../components/HeaderTitle';
import { getAllGenres } from '../../services/genre';
import GenreChip from '../../components/GenreChip';
import theme from '../../theme';
import ClubPrivacySlider from '../../components/ClubPrivacySlider';
import { CLUB_SIZE_NO_LIMIT_LABEL } from '../../common/globalConstants';
import ClubMembershipEditor from '../../components/ClubMembershipEditor';

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
  genresContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  centeredColumnContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  twoLabelSwitchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

interface CreateClubRouteParams {
  id: string;
}

interface CreateClubProps extends RouteComponentProps<CreateClubRouteParams> {
  user: User | null;
}

const readingSpeeds: ReadingSpeed[] = ['fast', 'moderate', 'slow'];
const groupVibes: GroupVibe[] = [
  'chill',
  'first-timers',
  'learning',
  'nerdy',
  'power',
];

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

  const centerComponent = <HeaderTitle title="Create a Club" />;

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

  const [genres, setGenres] = React.useState<Services.GetGenres | null>(null);
  const [limitGroupSize, setLimitGroupSize] = React.useState<boolean>(false);
  const [selectedGroupSize, setSelectedGroupSize] = React.useState<number>(4);
  const [selectedGroupSpeed, setSelectedGroupSpeed] = React.useState<
    ReadingSpeed
  >('moderate');
  const [selectedGroupVibe, setSelectedGroupVibe] = React.useState<GroupVibe>(
    'chill'
  );
  const [selectedGroupName, setSelectedGroupName] = React.useState('');
  const [selectedGroupBio, setSelectedGroupBio] = React.useState('');
  const [selectedBooks, setSelectedBooks] = React.useState<
    FilterAutoMongoKeys<ShelfEntry>[]
  >([]);
  const [bookToRead, setBookToRead] = React.useState<FilterAutoMongoKeys<
    ShelfEntry
  > | null>(null);
  const [selectedGenres, setSelectedGenres] = React.useState<SelectedGenre[]>(
    []
  );
  const [unlistedClub, setUnlistedClub] = React.useState(false);
  const [creatingClub, setCreatingClub] = React.useState(false);
  const [
    createdClub,
    setCreatedClub,
  ] = React.useState<Services.CreateClubResult | null>(null);

  function onSubmitSelectedBooks(
    selectedBooks: FilterAutoMongoKeys<ShelfEntry>[],
    bookToRead: FilterAutoMongoKeys<ShelfEntry> | null
  ) {
    setSelectedBooks(selectedBooks);
    setBookToRead(bookToRead);
  }

  // Things to do on mount.
  useEffect(() => {
    getGenres();
  }, []);

  useEffect(() => {
    if (createdClub) {
      props.history.replace(`/clubs/${createdClub.club._id}`);
    }
  }, [createdClub, props.history]);

  async function createClubOnClick() {
    if (!bookToRead) {
      return;
    }
    let initShelf: UninitClubShelfType = {
      current: [],
      notStarted: [],
      read: [],
    };
    selectedBooks.forEach(b => {
      if (b.sourceId !== bookToRead.sourceId) {
        initShelf.notStarted.push({
          ...b,
          readingState: 'notStarted',
        });
      } else {
        initShelf.current.push({
          ...b,
          readingState: 'current',
        });
      }
    });
    const maxMembers = limitGroupSize ? selectedGroupSize : -1;
    const clubObj: Services.CreateClubProps = {
      name: selectedGroupName,
      newShelf: initShelf,
      bio: selectedGroupBio,
      maxMembers,
      vibe: selectedGroupVibe,
      genres: selectedGenres,
      readingSpeed: selectedGroupSpeed,
      channelSource: 'discord',
      unlisted: unlistedClub,
    };
    setCreatingClub(true);
    const createdClubRes = await createClub(clubObj);
    const { data } = createdClubRes;
    if (data) {
      setCreatedClub(data);
    }
  }

  const getGenres = async () => {
    const res = await getAllGenres();
    if (res.status === 200) {
      setGenres(res.data);
    } else {
      // TODO: error handling
    }
  };

  const onGenreClick = (key: string, currActive: boolean) => {
    if (!genres) {
      return;
    }
    let selectedGenresNew: SelectedGenre[];
    if (!currActive) {
      selectedGenresNew = [...selectedGenres];
      selectedGenresNew.push({
        key,
        name: genres.genres[key].name,
      });
    } else {
      selectedGenresNew = selectedGenres.filter(sg => sg.key !== key);
    }
    setSelectedGenres(selectedGenresNew);
  };

  const validateForm = (): boolean => {
    if (selectedGroupBio === '') {
      return false;
    } else if (selectedGroupName === '') {
      return false;
    } else if (!bookToRead) {
      return false;
    } else if (selectedBooks.length === 0) {
      return false;
    } else if (selectedGenres.length === 0) {
      return false;
    }
    return true;
  };

  const handleGroupSizeChange = (
    e: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    const newVal = e.target.value as string;
    if (newVal === CLUB_SIZE_NO_LIMIT_LABEL) {
      setLimitGroupSize(false);
    } else {
      setSelectedGroupSize(parseInt(newVal));
    }
  };

  const screenSmallerThanSm = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <>
      <Header leftComponent={leftComponent} centerComponent={centerComponent} />
      <Container className={classes.formContainer} maxWidth="md">
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
          <Typography variant="subtitle1">
            What books would you like to read?
          </Typography>
          {selectedBooks.length > 0 && (
            <Typography
              variant="subtitle2"
              color="textSecondary"
              className={classes.sectionHeader}
            >
              Select a book for your club to read first.
            </Typography>
          )}
          <BookSearch
            onSubmitBooks={onSubmitSelectedBooks}
            maxSelected={20}
            radioValue={
              bookToRead && bookToRead.sourceId ? bookToRead.sourceId : 'none'
            }
            primary={'radio'}
            secondary={'delete'}
          />
        </div>
        {genres && (
          <div className={classes.sectionContainer}>
            <Typography variant="subtitle1">
              What genres will your club be reading?
            </Typography>
            <div className={classes.genresContainer}>
              {genres.mainGenres.map(g => (
                <GenreChip
                  key={g}
                  genreKey={g}
                  name={genres.genres[g].name}
                  active={selectedGenres.some(sg => sg.key === g)}
                  clickable={true}
                  onClick={onGenreClick}
                  small={screenSmallerThanSm}
                />
              ))}
            </div>
          </div>
        )}
        <div className={classes.sectionContainer}>
          <Typography variant="subtitle1" className={classes.sectionHeader}>
            What's your club's privacy setting?
          </Typography>
          <ClubPrivacySlider
            onChange={(unlistedValue: boolean) =>
              setUnlistedClub(unlistedValue)
            }
            unlisted={unlistedClub}
          />
        </div>
        <div className={classes.sectionContainer}>
          <Typography variant="subtitle1" className={classes.sectionHeader}>
            Would you like to limit the number of group members?
          </Typography>
          <ClubMembershipEditor
            handleGroupLimitSwitch={() => setLimitGroupSize(!limitGroupSize)}
            handleGroupSizeChange={handleGroupSizeChange}
            limitGroupSize={limitGroupSize}
            numMembers={0}
            selectedGroupSize={selectedGroupSize}
          />
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
                key={speed}
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
                key={vibe}
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
                disabled={!validateForm()}
                onClick={createClubOnClick}
                color="secondary"
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
