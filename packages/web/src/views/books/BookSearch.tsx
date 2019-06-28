import React, { useEffect } from 'react';
import { GoogleBooks, ShelfEntry } from '@caravan/buddy-reading-types';
import {
  Container,
  Paper,
  InputBase,
  IconButton,
  Popover,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import SearchResultCards from '../books/SearchResultCards';
import SelectedBookCards from '../books/SelectedBookCards';
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
}));

interface BookSearchProps {
  onSubmitBooks: (
    selectedBooks: ShelfEntry[],
    bookToRead: ShelfEntry | null
  ) => void;
  maxSelected: number;
  radioValue?: string;
}

const searchRef = React.createRef();

export default function BookSearch(props: BookSearchProps) {
  const classes = useStyles();
  const { onSubmitBooks, maxSelected, radioValue } = props;

  const [bookSearchQuery, setBookSearchQuery] = React.useState<string>('');
  const [
    searchResults,
    setSearchResults,
  ] = React.useState<GoogleBooks.Books | null>(null);
  const [showPopper, setShowPopper] = React.useState<boolean>(false);
  const [selectedBooks, setSelectedBooks] = React.useState<ShelfEntry[]>([]);
  const [numSelected, setNumSelected] = React.useState<number>(0);
  const [bookToRead, setBookToRead] = React.useState<ShelfEntry | null>(null);

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
      bookSearch(bookSearchQuery);
      setShowPopper(true);
    }
  }

  function instanceOfGB(object: any): object is GoogleBooks.Item {
    return 'id' in object;
  }

  function onAddBook(book: GoogleBooks.Item | ShelfEntry) {
    let bookAsShelfEntry: ShelfEntry;
    if (instanceOfGB(book)) {
      bookAsShelfEntry = getShelfFromGoogleBooks(
        [book],
        book.id
      )[0] as ShelfEntry;
    } else {
      bookAsShelfEntry = book;
    }
    let newBooks: ShelfEntry[];
    if (numSelected === maxSelected) {
      const selectedBooksCopy = [...selectedBooks];
      selectedBooksCopy.shift();
      newBooks = [...selectedBooksCopy, bookAsShelfEntry];
    } else {
      newBooks = [...selectedBooks, bookAsShelfEntry];
      setNumSelected(numSelected + 1);
    }
    newBooks = newBooks.map(b => {
      if (b._id !== bookAsShelfEntry._id && b.readingState === 'current') {
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
      selected => selected._id !== bookId
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
    const book = selectedBooks.find(book => book._id === bookId);
    if (book) {
      setBookToRead(book);
      onSubmitBooks(selectedBooks, book);
    }
  }

  function handleSearchClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    bookSearch(bookSearchQuery);
    setShowPopper(true);
  }

  return (
    <>
      <div className={classes.root}>
        <Paper className={classes.searchBarContainer}>
          <IconButton
            className={classes.iconButton}
            aria-label="Menu"
            onClick={handleSearchClick}
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
            ref={searchRef}
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
            <Container maxWidth="sm" style={{ padding: 0 }}>
              <BookList
                data={
                  getShelfFromGoogleBooks(searchResults.items) as ShelfEntry[]
                }
                secondary={'add'}
                onAdd={onAddBook}
              />
            </Container>
          </Popover>
        )}
      </div>
      {selectedBooks.length > 0 && (
        <div className={classes.bookListContainer}>
          <BookList
            data={selectedBooks}
            primary={'radio'}
            secondary={'delete'}
            onRadioPress={onChangeBookToRead}
            radioValue={radioValue}
            onDelete={onDeleteSelectedBook}
          />
        </div>
      )}
    </>
  );
}
