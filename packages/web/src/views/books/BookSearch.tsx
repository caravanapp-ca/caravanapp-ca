import React, { useEffect } from 'react';
import {
  GoogleBooks,
  ShelfEntry,
  FilterAutoMongoKeys,
} from '@caravan/buddy-reading-types';
import {
  Container,
  Paper,
  InputBase,
  IconButton,
  Popover,
  Typography,
  useTheme,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import { searchGoogleBooks } from '../../services/book';
import BookList from '../club/shelf-view/BookList';
import { getShelfFromGoogleBooks } from '../club/functions/ClubFunctions';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  searchBarContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    marginLeft: 8,
    marginRight: 8,
    flex: 1,
  },
  iconButton: {},
  bookListContainer: {
    marginTop: theme.spacing(1),
  },
  searchResultsContainer: {
    padding: 0,
    maxHeight: 384,
    overflow: 'auto',
  },
  googleLogo: {
    marginRight: theme.spacing(1),
  },
}));

interface BookSearchProps {
  onSubmitBooks: (
    selectedBooks: FilterAutoMongoKeys<ShelfEntry>[],
    bookToRead: FilterAutoMongoKeys<ShelfEntry> | null
  ) => void;
  maxSelected?: number;
  radioValue?: string;
  primary?: 'radio';
  secondary?: 'delete';
  initialSelectedBooks?: FilterAutoMongoKeys<ShelfEntry>[];
}

const searchRef = React.createRef();

export default function BookSearch(props: BookSearchProps) {
  const classes = useStyles();
  const theme = useTheme();
  const {
    onSubmitBooks,
    radioValue,
    primary,
    secondary,
    initialSelectedBooks,
  } = props;

  const maxSelected = props.maxSelected || 1000;

  const [bookSearchQuery, setBookSearchQuery] = React.useState<string>('');
  const [
    searchResults,
    setSearchResults,
  ] = React.useState<GoogleBooks.Books | null>(null);
  const [showPopper, setShowPopper] = React.useState<boolean>(false);
  const [selectedBooks, setSelectedBooks] = React.useState<
    FilterAutoMongoKeys<ShelfEntry>[]
  >(initialSelectedBooks || []);
  const [numSelected, setNumSelected] = React.useState<number>(
    (initialSelectedBooks && initialSelectedBooks.length) || 0
  );
  const [bookToRead, setBookToRead] = React.useState<FilterAutoMongoKeys<
    ShelfEntry
  > | null>(null);

  useEffect(() => {
    if (!bookSearchQuery || bookSearchQuery.length === 0) {
      setShowPopper(false);
      setSearchResults(null);
    }
  }, [bookSearchQuery]);

  async function bookSearch(query: string) {
    if (query) {
      const results = await searchGoogleBooks(query);
      setSearchResults(results);
    }
  }

  function handleOnKeyDown(e: React.KeyboardEvent<any>) {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  }

  function instanceOfGB(object: any): object is GoogleBooks.Item {
    return 'id' in object;
  }

  function onAddBook(book: GoogleBooks.Item | ShelfEntry) {
    let bookAsShelfEntry: FilterAutoMongoKeys<ShelfEntry>;
    if (instanceOfGB(book)) {
      bookAsShelfEntry = getShelfFromGoogleBooks([book], book.id)[0];
    } else {
      bookAsShelfEntry = book;
    }
    let newBooks: FilterAutoMongoKeys<ShelfEntry>[];
    if (numSelected === maxSelected) {
      const selectedBooksCopy = [...selectedBooks];
      selectedBooksCopy.shift();
      newBooks = [...selectedBooksCopy, bookAsShelfEntry];
    } else {
      newBooks = [...selectedBooks, bookAsShelfEntry];
      setNumSelected(numSelected + 1);
    }
    newBooks = newBooks.map(b => {
      if (
        b.sourceId !== bookAsShelfEntry.sourceId &&
        b.readingState === 'current'
      ) {
        const bCopy = { ...b };
        bCopy.readingState = 'notStarted';
        return bCopy;
      } else {
        return b;
      }
    });
    onSubmitBooks(newBooks, bookAsShelfEntry);
    setBookToRead(bookAsShelfEntry);
    setSelectedBooks(newBooks);
    setBookSearchQuery('');
  }

  function onDeleteSelectedBook(bookId: string) {
    const updatedBooks = selectedBooks.filter(
      selected => selected.sourceId !== bookId
    );
    if (bookId === radioValue) {
      onSubmitBooks(updatedBooks, null);
      setBookToRead(null);
    } else {
      onSubmitBooks(updatedBooks, bookToRead);
    }
    setSelectedBooks(updatedBooks);
    setNumSelected(numSelected - 1);
  }

  function onChangeBookToRead(bookId: string) {
    const book = selectedBooks.find(book => book.sourceId === bookId);
    if (book) {
      setBookToRead(book);
      onSubmitBooks(selectedBooks, book);
    }
  }

  async function handleSearchClick() {
    await bookSearch(bookSearchQuery);
    setShowPopper(true);
  }

  return (
    <>
      <div className={classes.root}>
        <Paper className={classes.searchBarContainer} ref={searchRef}>
          <IconButton
            className={classes.iconButton}
            aria-label="Menu"
            onClick={handleSearchClick}
          >
            <SearchIcon />
          </IconButton>
          <InputBase
            className={classes.input}
            placeholder="Search Google Books"
            fullWidth
            value={bookSearchQuery}
            inputProps={{ 'aria-label': 'Add a Book' }}
            onChange={e => setBookSearchQuery(e.target.value)}
            onKeyDown={handleOnKeyDown}
          />
        </Paper>
        {searchResults && showPopper && (
          <Popover
            open={showPopper}
            anchorEl={searchRef.current as Element}
            onClose={() => setShowPopper(false)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Container className={classes.searchResultsContainer}>
              <BookList
                data={
                  getShelfFromGoogleBooks(searchResults.items) as ShelfEntry[]
                }
                secondary={'add'}
                onAdd={onAddBook}
                footerElement={
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{
                      fontStyle: 'italic',
                      textAlign: 'center',
                      marginLeft: theme.spacing(1),
                      marginRight: theme.spacing(1),
                    }}
                  >
                    {searchResults.totalItems > 0
                      ? "Don't see what you're looking for? Try more precise search terms."
                      : "We didn't find anything for these search terms. Try again!"}
                  </Typography>
                }
              />
            </Container>
          </Popover>
        )}
      </div>
      {selectedBooks.length > 0 && (
        <div className={classes.bookListContainer}>
          <BookList
            data={selectedBooks}
            primary={primary ? primary : undefined}
            secondary={secondary ? secondary : undefined}
            onRadioPress={onChangeBookToRead}
            radioValue={radioValue ? radioValue : undefined}
            onDelete={onDeleteSelectedBook}
          />
        </div>
      )}
    </>
  );
}
