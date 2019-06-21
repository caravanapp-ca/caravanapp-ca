import React, { useEffect } from 'react';
import { GoogleBooks } from '@caravan/buddy-reading-types';
import { Container, Paper, InputBase, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import SearchResultCards from '../books/SearchResultCards';
import SelectedBookCards from '../books/SelectedBookCards';
import { makeStyles } from '@material-ui/core/styles';
import { searchGoogleBooks } from '../../services/book';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    borderRadius: 10,
  },
  searchContainer: {
    padding: 0,
    marginBottom: 30,
    position: 'relative',
  },
  input: {
    marginLeft: 8,
    flex: 1,
    paddingRight: 10,
  },
  iconButton: {
    padding: 10,
  },
}));

interface BookSearchProps {
  onSubmitBooks: (
    selectedBooks: GoogleBooks.Item[],
    bookToRead: GoogleBooks.Item
  ) => void;
  maxSelected: number;
}

export default function BookSearch(props: BookSearchProps) {
  const classes = useStyles();

  const [bookSearchQuery, setBookSearchQuery] = React.useState<string>('');
  const [
    searchResults,
    setSearchResults,
  ] = React.useState<GoogleBooks.Books | null>(null);
  const [searchHidden, setSearchHidden] = React.useState<boolean>(false);
  const [selectedBooks, setSelectedBooks] = React.useState<GoogleBooks.Item[]>(
    []
  );
  const [numSelected, setNumSelected] = React.useState<number>(0);
  const [bookToRead, setBookToRead] = React.useState<GoogleBooks.Item | null>(
    null
  );

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

  function onAddBook(book: GoogleBooks.Item) {
    const { onSubmitBooks, maxSelected } = props;
    let newBooks;
    if (numSelected === maxSelected) {
      const selectedBooksCopy = [...selectedBooks];
      selectedBooksCopy.shift();
      newBooks = [...selectedBooksCopy, book];
    } else {
      newBooks = [...selectedBooks, book];
      setNumSelected(numSelected + 1);
    }
    if (!bookToRead) {
      setBookToRead(book);
      onSubmitBooks(newBooks, book);
    } else {
      onSubmitBooks(newBooks, bookToRead);
    }
    setSelectedBooks(newBooks);
    setBookSearchQuery('');
  }

  function onDeleteSelectedBook(book: GoogleBooks.Item) {
    const updatedBooks = selectedBooks.filter(
      selected => selected.id !== book.id
    );
    setSelectedBooks(updatedBooks);
    setNumSelected(numSelected - 1);
  }

  function onChangeBookToRead(book: GoogleBooks.Item) {
    const { onSubmitBooks } = props;
    setBookToRead(book);
    onSubmitBooks(selectedBooks, book);
  }

  return (
    <>
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
          firstBookId={selectedBooks[0].id}
          onDeleted={onDeleteSelectedBook}
          onChangeBookToRead={onChangeBookToRead}
        />
      )}
    </>
  );
}
