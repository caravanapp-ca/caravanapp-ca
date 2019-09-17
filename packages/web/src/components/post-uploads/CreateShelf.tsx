import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  Services,
  FilterAutoMongoKeys,
  ShelfEntry,
  SelectedGenre,
  PostContent,
  PostUserInfo,
  User,
} from '@caravan/buddy-reading-types';
import {
  makeStyles,
  Typography,
  Container,
  TextField,
  CircularProgress,
  useMediaQuery,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import GenreChip from '../GenreChip';
import BookSearch from '../../views/books/BookSearch';
import { uploadPost, getFeedViewerUserInfo } from '../../services/post';
import Header from '../Header';
import HeaderTitle from '../HeaderTitle';
import { getAllGenres } from '../../services/genre';
import theme from '../../theme';

const useStyles = makeStyles(theme => ({
  modal: {
    overflow: 'scroll',
    'webkit-overflow-scrolling': 'touch',
  },
  appBar: {
    position: 'relative',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  dialogContent: {
    paddingBottom: theme.spacing(2),
  },
  sectionContainer: {
    marginTop: theme.spacing(4),
  },
  genresContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
}));

interface CreateShelfProps extends RouteComponentProps {
  user: User | null;
}

export default function CreateShelf(props: CreateShelfProps) {
  const classes = useStyles();
  const { user } = props;

  const [shelf, setShelf] = React.useState<FilterAutoMongoKeys<ShelfEntry>[]>(
    []
  );
  const [
    postAuthorUserInfo,
    setPostAuthorUserInfo,
  ] = React.useState<PostUserInfo | null>(null);
  const [genres, setGenres] = React.useState<Services.GetGenres | null>(null);
  const [shelfGenres, setShelfGenres] = React.useState<SelectedGenre[]>([]);
  const [shelfTitle, setShelfTitle] = React.useState<string>('');
  const [shelfDescription, setShelfDescription] = React.useState<string>('');
  const [postingShelf, setPostingShelf] = React.useState(false);
  const [createdShelf, setCreatedShelf] = React.useState<boolean>(false);

  const readyToPost =
    shelf.length > 1 &&
    shelfTitle.split(' ').join('').length > 0 &&
    shelfGenres.length > 0;

  const leftComponent = (
    <Button color="inherit" onClick={onCloseModal}>
      Cancel
    </Button>
  );

  const centerComponent = <HeaderTitle title="Create Shelf" />;

  const rightComponent = (
    <Button color="inherit" disabled={!readyToPost} onClick={postShelf}>
      Post
    </Button>
  );

  useEffect(() => {
    getGenres();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    (async () => {
      if (user && user._id) {
        const postAuthorUserInfoRes = await getFeedViewerUserInfo(user._id);
        if (postAuthorUserInfoRes.status === 200) {
          setPostAuthorUserInfo(postAuthorUserInfoRes.data);
        }
      }
    })();
  }, [user]);

  useEffect(() => {
    if (createdShelf) {
      props.history.goBack();
    }
  }, [createdShelf]);

  function onSubmitSelectedBooks(
    selectedBooks: FilterAutoMongoKeys<ShelfEntry>[]
  ) {
    setShelf(selectedBooks);
  }

  function onCloseModal() {
    setShelfGenres([]);
    setShelf([]);
    setShelfTitle('');
    setShelfDescription('');
    props.history.goBack();
  }

  async function postShelf() {
    if (user && user._id && postAuthorUserInfo) {
      const postContent: PostContent = {
        postType: 'shelf',
        shelf,
        title: shelfTitle,
        genres: shelfGenres,
        description: shelfDescription,
      };
      setPostingShelf(true);
      const uploadShelfRes = await uploadPost(postContent);
      const { data } = uploadShelfRes;
      if (data) {
        setPostingShelf(false);
        setCreatedShelf(true);
      }
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
      selectedGenresNew = [...shelfGenres];
      selectedGenresNew.push({
        key,
        name: genres.genres[key].name,
      });
    } else {
      selectedGenresNew = shelfGenres.filter(sg => sg.key !== key);
    }
    setShelfGenres(selectedGenresNew);
  };

  const screenSmallerThanSm = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <>
      <Header
        leftComponent={leftComponent}
        centerComponent={centerComponent}
        rightComponent={rightComponent}
      />
      <Container maxWidth="md" className={classes.dialogContent}>
        <div className={classes.sectionContainer}>
          <Typography variant="h6" gutterBottom>
            Add books (minimum 2) *
          </Typography>
          <BookSearch
            onSubmitBooks={onSubmitSelectedBooks}
            maxSelected={50}
            secondary="delete"
          />
        </div>
        {genres && (
          <div className={classes.sectionContainer}>
            <Typography variant="h6" gutterBottom>
              Tag genres *
            </Typography>
            <div className={classes.genresContainer}>
              {genres.mainGenres.map(g => (
                <GenreChip
                  key={g}
                  genreKey={g}
                  name={genres.genres[g].name}
                  active={shelfGenres.some(sg => sg.key === g)}
                  clickable={true}
                  onClick={onGenreClick}
                  small={screenSmallerThanSm}
                />
              ))}
            </div>
          </div>
        )}
        <div className={classes.sectionContainer}>
          <Typography variant="h6" gutterBottom>
            Name this shelf *
          </Typography>
          <TextField
            id="filled-name"
            label="Shelf Title"
            helperText="50 character limit"
            variant="outlined"
            fullWidth
            inputProps={{ maxLength: 50 }}
            onChange={(
              e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
              >
            ) => setShelfTitle(e.target.value)}
          />
        </div>
        <div className={classes.sectionContainer}>
          <Typography variant="h6" gutterBottom>
            Describe this shelf
          </Typography>
          <TextField
            id="filled-name"
            label="Shelf Description"
            helperText="300 character limit"
            variant="outlined"
            multiline
            rows="4"
            fullWidth
            inputProps={{ maxLength: 300 }}
            onChange={(
              e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
              >
            ) => setShelfDescription(e.target.value)}
          />
        </div>
        <div className={classes.sectionContainer}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-end',
              marginBottom: theme.spacing(6),
            }}
          >
            {!postingShelf && (
              <Button
                variant="contained"
                disabled={!readyToPost}
                onClick={postShelf}
                color="secondary"
              >
                POST
              </Button>
            )}
            {postingShelf && <CircularProgress />}
          </div>
        </div>
      </Container>
    </>
  );
}
