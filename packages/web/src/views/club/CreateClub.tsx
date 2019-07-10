import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  User,
  ShelfEntry,
  ReadingSpeed,
  GroupVibe,
  Services,
  FilterAutoMongoKeys,
} from '@caravan/buddy-reading-types';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import BackIcon from '@material-ui/icons/ArrowBackIos';
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
import HeaderTitle from '../../components/HeaderTitle';
import GroupSizeSelector from '../../components/GroupSizeSelector';

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

const groupSizeMin = 2;
const groupSizeMax = 32;
let groupSizesStrArr: string[] = [];
for (let i = groupSizeMin; i <= groupSizeMax; i++) {
  groupSizesStrArr.push(i.toString());
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
  const [unlistedClub] = React.useState(false);
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

  useEffect(() => {
    if (createdClub) {
      props.history.replace(`/clubs/${createdClub.club._id}`);
    }
  }, [createdClub, props.history]);

  async function createClubOnClick() {
    if (!bookToRead) {
      return;
    }
    const selectedBooksWReadingState = selectedBooks.map(book => {
      if (
        book.sourceId !== bookToRead.sourceId &&
        book.readingState !== 'notStarted'
      ) {
        const bookCopy = { ...book };
        bookCopy.readingState = 'notStarted';
        return bookCopy;
      } else if (
        book.sourceId === bookToRead.sourceId &&
        book.readingState !== 'current'
      ) {
        const bookCopy = { ...book };
        bookCopy.readingState = 'current';
        return bookCopy;
      }
      return book;
    });

    const clubObj: any = {
      name: selectedGroupName,
      shelf: selectedBooksWReadingState,
      bio: selectedGroupBio,
      maxMembers: selectedGroupSize,
      vibe: selectedGroupVibe,
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

  // let unlistedSwitchLabel = 'Anyone can find and join my club.';
  // if (unlistedClub) {
  //   unlistedSwitchLabel = 'Only friends I share the link with can join my club.';
  // }

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
        <div className={classes.sectionContainer}>
          <Typography variant="subtitle1" className={classes.sectionHeader}>
            How many club members do you want?
          </Typography>
          <GroupSizeSelector
            onChangeSize={e =>
              setSelectedGroupSize(parseInt(e.target.value as string))
            }
            selectedSize={selectedGroupSize.toString()}
            sizes={groupSizesStrArr.map(str => ({
              label: str,
              enabled: true,
            }))}
            showContactMessage={true}
          />
          {/* <div
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
                key={size.toString()}
              >
                <Radio
                  checked={selectedGroupSize === size}
                  onChange={() => setSelectedGroupSize(size)}
                  value={size.toString()}
                  color="primary"
                />
                <Typography>{size}</Typography>
              </div>
            ))}
          </div> */}
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
                disabled={
                  selectedGroupBio === '' ||
                  selectedGroupName === '' ||
                  !bookToRead ||
                  selectedBooks.length === 0
                }
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
