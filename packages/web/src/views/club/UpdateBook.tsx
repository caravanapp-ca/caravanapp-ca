import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  User,
  ShelfEntry,
  GoogleBooks,
  Services,
} from '@caravan/buddy-reading-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Typography,
  Switch,
  Button,
  Box,
  Container,
  Radio,
} from '@material-ui/core';
import { MoreVert, ArrowBack } from '@material-ui/icons';
import AdapterLink from '../../components/AdapterLink';
import Header from '../../components/Header';
import BookList from './shelf-view/BookList';
import BookSearch from '../books/BookSearch';
import { updateCurrentlyReadBook, getClub } from '../../services/club';
import {
  getCurrentBook,
  getWantToRead,
  getShelfFromGoogleBooks,
} from './functions/ClubFunctions';

interface UpdateBookRouteParams {
  id: string;
}

interface UpdateBookProps extends RouteComponentProps<UpdateBookRouteParams> {
  user: User | null;
}

const useStyles = makeStyles(theme => ({
  finishedSwitchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function UpdateBook(props: UpdateBookProps) {
  const classes = useStyles();
  const clubId = props.match.params.id;

  const [finished, setFinished] = React.useState(true);
  const [club, setClub] = React.useState<Services.GetClubById | null>(null);
  const [loadedClub, setLoadedClub] = React.useState<boolean>(false);
  const [currBook, setCurrBook] = React.useState<ShelfEntry | null>(null);
  const [wantToRead, setWantToRead] = React.useState<ShelfEntry[]>([]);
  const [bookToRead, setBookToRead] = React.useState<ShelfEntry | null>(null);
  const [newBookForShelf, setNewBookForShelf] = React.useState<boolean>(false);

  useEffect(() => {
    const getClubFun = async () => {
      try {
        const club = await getClub(clubId);
        setClub(club);
        if (club) {
          const currBook = getCurrentBook(club);
          setCurrBook(currBook);
          const wantToRead = getWantToRead(club);
          setWantToRead(wantToRead);
          setLoadedClub(true);
        }
      } catch (err) {
        console.error(err);
        setLoadedClub(true);
      }
    };
    getClubFun();
  }, [clubId]);

  function onSubmitSelectedBooks(
    selectedBooks: ShelfEntry[],
    bookToRead: ShelfEntry
  ) {
    setBookToRead(bookToRead);
    setNewBookForShelf(true);
  }

  async function onSaveSelection() {
    if (!bookToRead || !currBook) {
      return;
    }
    const result = await updateCurrentlyReadBook(
      clubId,
      bookToRead,
      newBookForShelf,
      currBook._id,
      finished
    );
    if (typeof result === 'number') {
      // need to do error handling here based on error code
      return;
    }
    // navigate to club info page
    // show snack bar (on next page)
  }

  function onWantToReadSelect(bookId: string) {
    const getBookToRead = wantToRead.find(book => book._id === bookId);
    if (getBookToRead) {
      setBookToRead(getBookToRead);
      setNewBookForShelf(false);
    }
  }

  const leftComponent = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="Back"
      onClick={() => props.history.goBack()}
    >
      <ArrowBack />
    </IconButton>
  );

  const centerComponent = <Typography variant="h6">Update Club</Typography>;

  const rightComponent = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="More"
      component={AdapterLink}
      to="/"
    >
      <MoreVert />
    </IconButton>
  );

  let finishedLabel;
  if (currBook) {
    finishedLabel = `We finished ${currBook.title}`;
    if (!finished) {
      finishedLabel = `We'll finish ${currBook.title} later`;
    }
  }

  let searchLabel = 'Or you can search for another book.';
  if (wantToRead.length === 0) {
    searchLabel = 'Search for a new book to set as your current read.';
  }

  const selectedLabel = "We'll read this book next!";

  return (
    <div>
      <Header
        leftComponent={leftComponent}
        centerComponent={centerComponent}
        rightComponent={rightComponent}
      />
      <Container>
        <Box>
          {currBook && (
            <>
              <Typography>Your club is currently reading:</Typography>
              <BookList data={[currBook]} />
              <div className={classes.finishedSwitchContainer}>
                <Switch
                  checked={finished}
                  onChange={(event, checked) => {
                    setFinished(checked);
                  }}
                  value="finished"
                  color="primary"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                <Typography>{finishedLabel}</Typography>
              </div>
            </>
          )}
          {wantToRead.length > 0 && (
            <>
              <Typography>
                Here are the books in your club's Want to Read list. You can
                pick one for your next read.
              </Typography>
              <BookList
                data={wantToRead}
                primary={'radio'}
                onRadioPress={onWantToReadSelect}
                radioValue={
                  bookToRead && bookToRead._id ? bookToRead._id : 'none'
                }
                selectedLabel={selectedLabel}
              />
            </>
          )}
          <Typography>{searchLabel}</Typography>
          <BookSearch
            onSubmitBooks={onSubmitSelectedBooks}
            maxSelected={3}
            radioValue={bookToRead && bookToRead._id ? bookToRead._id : 'none'}
            selectedLabel={selectedLabel}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={onSaveSelection}
          >
            SAVE
          </Button>
        </Box>
      </Container>
    </div>
  );
}
