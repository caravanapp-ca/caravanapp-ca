import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  User,
  ShelfEntry,
  Services,
  FilterAutoMongoKeys,
  ReadingState,
} from '@caravan/buddy-reading-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { IconButton, Typography, Button, Container } from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import Header from '../../components/Header';
import BookList from './shelf-view/BookList';
import BookSearch from '../books/BookSearch';
import { getClub, updateShelf } from '../../services/club';
import ProfileHeaderIcon from '../../components/ProfileHeaderIcon';
import HeaderTitle from '../../components/HeaderTitle';
import {
  DragDropContext,
  DropResult,
  ResponderProvided,
  DragStart,
} from 'react-beautiful-dnd';
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

const isValidCurrentShelf = (
  shelfContent: FilterAutoMongoKeys<ShelfEntry>[]
): { valid: boolean; errMessage: string } => {
  if (shelfContent.length !== 1) {
    return {
      valid: false,
      errMessage: 'The "Currently Reading" shelf must contain 1 book',
    };
  }

  return { valid: true, errMessage: '' };
};

export default function UpdateBook(props: UpdateBookProps) {
  const classes = useStyles();
  const theme = useTheme();
  const clubId = props.match.params.id;
  const user = props.user;

  const [madeSavableMods, setMadeSavableMods] = React.useState<boolean>(false);
  const [validCurrentShelf, setValidCurrentShelf] = React.useState<{
    valid: boolean;
    errMessage: string;
  }>({ valid: true, errMessage: '' });
  const [, setClub] = React.useState<Services.GetClubById | null>(null);
  const [, setLoadedClub] = React.useState<boolean>(false);
  const [sortedShelf, setSortedShelf] = React.useState<
    { [key in ReadingState]: (ShelfEntry | FilterAutoMongoKeys<ShelfEntry>)[] }
  >({
    current: [],
    notStarted: [],
    read: [],
  });
  const [draggingElementId, setDraggingElementId] = React.useState<
    string | undefined
  >(undefined);
  const [searchedBooks, setSearchedBooks] = React.useState<
    FilterAutoMongoKeys<ShelfEntry>[]
  >([]);

  useEffect(() => {
    const getClubFun = async () => {
      try {
        const club = await getClub(clubId);
        setClub(club);
        if (club) {
          setSortedShelf(club.newShelf);
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
    selectedBooks: FilterAutoMongoKeys<ShelfEntry>[]
  ) {
    setSearchedBooks(selectedBooks);
    setMadeSavableMods(true);
  }

  async function onSaveSelection() {
    if (!sortedShelf) {
      return;
    }
    if (searchedBooks.length > 0) {
      sortedShelf.notStarted = sortedShelf.notStarted.concat(searchedBooks);
    }
    const res = await updateShelf(clubId, sortedShelf);
    if (res.status === 200) {
      // TODO: show snack bar on next page
      props.history.goBack();
      notifyOfClubShelfUpdate(clubId);
    } else {
      // TODO: need to do error handling here based on error code
      return;
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

  const deleteHandler = (elementId: string, index: number, listId: string) => {
    const deleteId = listId as ReadingState;
    const newSortedShelf = { ...sortedShelf };
    newSortedShelf[deleteId].splice(index, 1);
    setSortedShelf(newSortedShelf);
  };

  const onDragStart = (initial: DragStart, provided: ResponderProvided) => {
    setDraggingElementId(initial.draggableId);
  };

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index == destination.index
    ) {
      return;
    }

    const newSortedShelf = { ...sortedShelf };
    let sourceDroppableId: ReadingState;
    let movedBook: any;

    if (source.droppableId === 'selected-books') {
      const newSearchedBooks = [...searchedBooks];
      movedBook = newSearchedBooks[source.index];
      newSearchedBooks.splice(source.index, 1);
      setSearchedBooks(newSearchedBooks);
    } else {
      sourceDroppableId = source.droppableId as ReadingState;
      movedBook = newSortedShelf[sourceDroppableId][source.index];
      newSortedShelf[sourceDroppableId].splice(source.index, 1);
    }

    const destDroppableId = destination.droppableId as ReadingState;
    newSortedShelf[destDroppableId].splice(destination.index, 0, movedBook);

    setSortedShelf(newSortedShelf);
    setDraggingElementId(undefined);

    const validCurrentShelf = isValidCurrentShelf(newSortedShelf.current);
    setValidCurrentShelf(validCurrentShelf);
    setMadeSavableMods(true);
  };

  return (
    <div>
      <Header
        leftComponent={leftComponent}
        centerComponent={centerComponent}
        rightComponent={rightComponent}
      />
      <Container className={classes.container} maxWidth={'md'}>
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          {sortedShelf.current && (
            <div className={classes.sectionContainer}>
              <Typography variant="h6" gutterBottom>
                Currently Reading
              </Typography>
              <BookList
                id="current"
                data={sortedShelf.current}
                secondary="delete"
                tertiary="buy"
                onDelete={deleteHandler}
                droppable
                draggingElementId={draggingElementId}
                error={validCurrentShelf}
              />
            </div>
          )}
          {sortedShelf.notStarted && (
            <div className={classes.sectionContainer}>
              <Typography variant="h6" gutterBottom>
                To be Read
              </Typography>
              <BookList
                id="notStarted"
                data={sortedShelf.notStarted}
                secondary="delete"
                tertiary="buy"
                onDelete={deleteHandler}
                droppable
                draggingElementId={draggingElementId}
              />
            </div>
          )}
          {sortedShelf.read && (
            <div className={classes.sectionContainer}>
              <Typography variant="h6" gutterBottom>
                Previously Read
              </Typography>
              <BookList
                id="read"
                data={sortedShelf.read}
                secondary="delete"
                tertiary="buy"
                onDelete={deleteHandler}
                droppable
                draggingElementId={draggingElementId}
              />
            </div>
          )}
          <div className={classes.sectionContainer}>
            <Typography variant="h6" gutterBottom>
              Search
            </Typography>
            <BookSearch
              onSubmitBooks={onSubmitSelectedBooks}
              maxSelected={9}
              secondary="delete"
              inheritSearchedBooks={searchedBooks}
            />
            {searchedBooks.length > 0 && (
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ marginTop: theme.spacing(1) }}
              >
                Books left in the "Search" list will automatically be added to
                your club's To be Read on save.
              </Typography>
            )}
          </div>
          <div className={classes.saveButtonContainer}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={onSaveSelection}
              disabled={
                !sortedShelf || !madeSavableMods || !validCurrentShelf.valid
              }
            >
              SAVE
            </Button>
          </div>
        </DragDropContext>
      </Container>
    </div>
  );
}
