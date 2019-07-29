import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  User,
  ShelfEntry,
  Services,
  FilterAutoMongoKeys,
  ReadingState,
} from '@caravan/buddy-reading-types';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Typography, Button, Container } from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import Header from '../../components/Header';
import BookList from './shelf-view/BookList';
import BookSearch from '../books/BookSearch';
import { getClub, updateShelf } from '../../services/club';
import ProfileHeaderIcon from '../../components/ProfileHeaderIcon';
import HeaderTitle from '../../components/HeaderTitle';
import { DragDropContext } from 'react-beautiful-dnd';
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

export default function UpdateBook(props: UpdateBookProps) {
  const classes = useStyles();
  const clubId = props.match.params.id;
  const user = props.user;

  const [madeSavableMods, setMadeSavableMods] = React.useState<boolean>(false);
  const [, setClub] = React.useState<Services.GetClubById | null>(null);
  const [, setLoadedClub] = React.useState<boolean>(false);
  const [sortedShelf, setSortedShelf] = React.useState<
    { [key in ReadingState]: (ShelfEntry | FilterAutoMongoKeys<ShelfEntry>)[] }
  >({
    current: [],
    notStarted: [],
    read: [],
  });
  const [, setSearchedBooks] = React.useState<
    FilterAutoMongoKeys<ShelfEntry>[]
  >([]);

  useEffect(() => {
    const getClubFun = async () => {
      try {
        const club = await getClub(clubId);
        setClub(club);
        if (club) {
          setSortedShelf(club.shelf);
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

  const onDragEnd = () => {};

  return (
    <div>
      <Header
        leftComponent={leftComponent}
        centerComponent={centerComponent}
        rightComponent={rightComponent}
      />
      <Container className={classes.container} maxWidth={'md'}>
        <DragDropContext onDragEnd={onDragEnd}>
          {sortedShelf.current && (
            <div className={classes.sectionContainer}>
              <Typography variant="h6" gutterBottom>
                Currently Reading
              </Typography>
              <BookList
                id="currently-reading"
                data={sortedShelf.current}
                tertiary="buy"
                droppable
              />
            </div>
          )}
          {sortedShelf.notStarted && (
            <div className={classes.sectionContainer}>
              <Typography variant="h6" gutterBottom>
                To be Read
              </Typography>
              <BookList
                id="not-started"
                data={sortedShelf.notStarted}
                tertiary="buy"
                droppable
              />
            </div>
          )}
          {sortedShelf.read && (
            <div className={classes.sectionContainer}>
              <Typography variant="h6" gutterBottom>
                Previously Read
              </Typography>
              <BookList
                id="previously-read"
                data={sortedShelf.read}
                tertiary="buy"
                droppable
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
            />
          </div>
          <div className={classes.saveButtonContainer}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={onSaveSelection}
              disabled={!sortedShelf || !madeSavableMods}
            >
              SAVE
            </Button>
          </div>
        </DragDropContext>
      </Container>
    </div>
  );
}
