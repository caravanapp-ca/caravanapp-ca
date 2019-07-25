import React, { useEffect, ChangeEvent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  User,
  ShelfEntry,
  Services,
  FilterAutoMongoKeys,
  CurrBookAction,
} from '@caravan/buddy-reading-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Typography,
  Button,
  Box,
  Container,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import Header from '../../components/Header';
import BookList from './shelf-view/BookList';
import BookSearch from '../books/BookSearch';
import { updateCurrentlyReadBook, getClub } from '../../services/club';
import { getCurrentBook, getWantToRead } from './functions/ClubFunctions';
import ProfileHeaderIcon from '../../components/ProfileHeaderIcon';
import HeaderTitle from '../../components/HeaderTitle';
import { notifyOfClubShelfUpdate } from '../../services/book';

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
    marginTop: theme.spacing(1),
  },
  button: {},
  container: {
    marginTop: theme.spacing(4),
  },
  sectionContainer: {
    marginTop: theme.spacing(4),
  },
  saveButtonContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    width: '100%',
    alignItems: 'center',
  },
  instructionText: {
    marginBottom: theme.spacing(1),
  },
  root: {
    display: 'flex',
  },
  formControl: {
    marginTop: theme.spacing(4),
  },
  group: {
    margin: theme.spacing(1, 0),
  },
}));

const currBookActions: CurrBookAction[] = [
  'current',
  'read',
  'notStarted',
  'delete',
];

export default function UpdateBook(props: UpdateBookProps) {
  const classes = useStyles();
  const clubId = props.match.params.id;
  const user = props.user;

  const [currBookAction, setCurrBookAction] = React.useState<CurrBookAction>(
    'current'
  );
  const [madeSavableMods, setMadeSavableMods] = React.useState<boolean>(false);
  const [, setClub] = React.useState<Services.GetClubById | null>(null);
  const [, setLoadedClub] = React.useState<boolean>(false);
  const [currBook, setCurrBook] = React.useState<ShelfEntry | null>(null);
  const [wantToRead, setWantToRead] = React.useState<
    (ShelfEntry | FilterAutoMongoKeys<ShelfEntry>)[]
  >([]);
  const [searchedBooks, setSearchedBooks] = React.useState<
    FilterAutoMongoKeys<ShelfEntry>[]
  >([]);
  const [bookToRead, setBookToRead] = React.useState<
    ShelfEntry | FilterAutoMongoKeys<ShelfEntry> | null
  >(null);
  const [newBookForShelf, setNewBookForShelf] = React.useState<boolean>(false);

  useEffect(() => {
    const getClubFun = async () => {
      try {
        const club = await getClub(clubId);
        setClub(club);
        if (club) {
          const currBook = getCurrentBook(club);
          setCurrBook(currBook);
          setBookToRead(currBook);
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
    selectedBooks: FilterAutoMongoKeys<ShelfEntry>[],
    bkToRead: FilterAutoMongoKeys<ShelfEntry> | null
  ) {
    setSearchedBooks(selectedBooks);
    setBookToRead(bkToRead);
    if (bkToRead) {
      if (currBookAction === 'current') {
        setCurrBookAction('notStarted');
      }
      setNewBookForShelf(true);
    }
    setMadeSavableMods(true);
  }

  async function onSaveSelection() {
    if (!bookToRead) {
      return;
    }
    let newWantToRead = wantToRead;
    if (!newBookForShelf) {
      newWantToRead = newWantToRead.filter(
        b => b.sourceId !== bookToRead.sourceId
      );
    }
    let searchedBooksFiltered: FilterAutoMongoKeys<
      ShelfEntry
    >[] = searchedBooks;
    if (newBookForShelf) {
      searchedBooksFiltered = searchedBooks.filter(
        b => b.sourceId !== bookToRead.sourceId
      );
    }
    newWantToRead = newWantToRead.concat(searchedBooksFiltered);
    const res = await updateCurrentlyReadBook(
      clubId,
      bookToRead,
      newBookForShelf,
      currBook ? currBook._id : null,
      currBookAction,
      newWantToRead
    );
    if (res.status === 200) {
      // TODO: show snack bar on next page
      props.history.goBack();
      notifyOfClubShelfUpdate(clubId);
    } else {
      // TODO: need to do error handling here based on error code
      return;
    }
  }

  function onWantToReadDelete(bookId: string, index: number) {
    if (bookToRead && bookToRead.sourceId === bookId) {
      setBookToRead(null);
    }
    let wantToReadNew = [...wantToRead];
    wantToReadNew.splice(index, 1);
    setWantToRead(wantToReadNew);
    setMadeSavableMods(true);
  }

  function onWantToReadSelect(bookId: string) {
    const getBookToRead = wantToRead.find(book => book.sourceId === bookId);
    if (getBookToRead) {
      if (currBookAction === 'current') {
        setCurrBookAction('notStarted');
      }
      setBookToRead(getBookToRead);
      setNewBookForShelf(false);
      setMadeSavableMods(true);
    }
  }

  function handleCurrBookActionChange(event: ChangeEvent<{}>, value: string) {
    if (value === 'current' && currBook) {
      setBookToRead(currBook);
      if (searchedBooks.length === 0) {
        setMadeSavableMods(false);
      }
    } else if (
      currBook &&
      bookToRead &&
      currBook.sourceId === bookToRead.sourceId
    ) {
      setBookToRead(null);
    }
    if (currBookActions.includes(value as CurrBookAction)) {
      setCurrBookAction(value as CurrBookAction);
    }
  }

  function backButtonAction() {
    if (props.history.length > 2) {
      props.history.goBack();
    } else {
      props.history.replace('/');
    }
  }

  const leftComponent = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="Back"
      onClick={backButtonAction}
    >
      <ArrowBackIos />
    </IconButton>
  );

  const centerComponent = <HeaderTitle title="Manage Shelf" />;

  const rightComponent = <ProfileHeaderIcon user={user} />;

  let searchLabel =
    "Or you can search for another book. Any books you don't select will be added to your club's Want to Read list.";
  if (wantToRead.length === 0) {
    searchLabel =
      "Search for a new book to set as your current read. Any books you don't select will be added to your club's Want to Read list.";
  }

  return (
    <div>
      <Header
        leftComponent={leftComponent}
        centerComponent={centerComponent}
        rightComponent={rightComponent}
      />
      <Container className={classes.container} maxWidth={'md'}>
        <Box>
          {currBook && (
            <div className={classes.sectionContainer}>
              <Typography className={classes.instructionText}>
                Your club is currently reading:
              </Typography>
              <BookList data={[currBook]} tertiary="buy" />
              <Typography />
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">{`What do you want to do with ${
                  currBook.title
                }?`}</FormLabel>
                <RadioGroup
                  aria-label="Current book actions"
                  name="currBook"
                  className={classes.group}
                  value={currBookAction}
                  onChange={handleCurrBookActionChange}
                >
                  <FormControlLabel
                    value={currBookActions[0]}
                    control={<Radio color="primary" />}
                    label="We're still reading (keep as current book)"
                  />
                  <FormControlLabel
                    value={currBookActions[1]}
                    color="primary"
                    control={<Radio color="primary" />}
                    label="We're finished! (add to previously read shelf)"
                  />
                  <FormControlLabel
                    value={currBookActions[2]}
                    color="primary"
                    control={<Radio color="primary" />}
                    label="We'll finish later (add to want to read shelf)"
                  />
                  <FormControlLabel
                    value={currBookActions[3]}
                    color="primary"
                    control={<Radio color="primary" />}
                    label="We've decided its a DNF (delete book from shelf)"
                  />
                </RadioGroup>
              </FormControl>
            </div>
          )}
          {wantToRead.length > 0 && (
            <div className={classes.sectionContainer}>
              <Typography className={classes.instructionText}>
                Here are the books in your club's Want to Read list. You can
                pick one for your next read.
              </Typography>
              <BookList
                data={wantToRead}
                primary="radio"
                secondary="delete"
                tertiary="buy"
                onDelete={onWantToReadDelete}
                onRadioPress={onWantToReadSelect}
                radioValue={
                  bookToRead && bookToRead.sourceId
                    ? bookToRead.sourceId
                    : 'none'
                }
              />
            </div>
          )}
          <div className={classes.sectionContainer}>
            <Typography className={classes.instructionText}>
              {searchLabel}
            </Typography>
            <BookSearch
              onSubmitBooks={onSubmitSelectedBooks}
              maxSelected={9}
              radioValue={
                bookToRead && bookToRead.sourceId ? bookToRead.sourceId : 'none'
              }
              primary="radio"
              secondary="delete"
            />
          </div>
          <div className={classes.saveButtonContainer}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={onSaveSelection}
              disabled={!bookToRead || !madeSavableMods}
            >
              SAVE
            </Button>
          </div>
        </Box>
      </Container>
    </div>
  );
}
