import React, { useEffect } from 'react';
import { GoogleBooks } from '@caravan/buddy-reading-types';
import { Container, Paper, InputBase, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import SearchResultCards from '../books/SearchResultCards';
import SelectedBookCards from '../books/SelectedBookCards';
import { makeStyles } from '@material-ui/core/styles';
import { searchGoogleBooks } from '../../services/book';

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
    if (bookToRead) {
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
