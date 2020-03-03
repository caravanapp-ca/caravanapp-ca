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
} from '@caravanapp/buddy-reading-types';
import {
  makeStyles,
  Typography,
  Container,
  TextField,
  CircularProgress,
  useMediaQuery,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import GenreChip from '../../components/GenreChip';
import BookSearch from '../books/BookSearch';
import {
  getFeedViewerUserInfo,
  getPostById,
  editPost,
} from '../../services/post';
import Header from '../../components/Header';
import HeaderTitle from '../../components/HeaderTitle';
import { getAllGenres } from '../../services/genre';
import theme from '../../theme';

const useStyles = makeStyles(theme => ({
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

interface EditShelfRouteParams {
  id: string;
}

interface EditShelfProps extends RouteComponentProps<EditShelfRouteParams> {
  user: User | null;
}

export default function EditShelf(props: EditShelfProps) {
  const classes = useStyles();
  const { user } = props;
  const postId = props.match.params.id;

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
  const [savingShelf, setSavingShelf] = React.useState(false);
  const [savedShelf, setSavedShelf] = React.useState<boolean>(false);

  const readyToPost =
    shelf.length > 1 &&
    shelfTitle.split(' ').join('').length > 0 &&
    shelfGenres.length > 0;

  const leftComponent = (
    <Button color="inherit" onClick={onCancel}>
      Cancel
    </Button>
  );

  const centerComponent = <HeaderTitle title="Edit Shelf" />;

  const rightComponent = (
    <Button color="inherit" disabled={!readyToPost} onClick={saveShelf}>
      Save
    </Button>
  );

  useEffect(() => {
    getGenres();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const getPost = async () => {
      try {
        const post = await getPostById(postId);
        if (post && post.content && post.content.postType === 'shelf') {
          if (post.content.shelf) {
            setShelf(post.content.shelf);
          }
          if (post.content.genres) {
            setShelfGenres(post.content.genres);
          }
          if (post.content.title) {
            setShelfTitle(post.content.title);
          }
          if (post.content.description) {
            setShelfDescription(post.content.description);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    getPost();
  }, [postId]);

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
    if (savedShelf) {
      props.history.goBack();
    }
  }, [savedShelf, props.history]);

  function onSubmitSelectedBooks(
    selectedBooks: FilterAutoMongoKeys<ShelfEntry>[]
  ) {
    setShelf(selectedBooks);
  }

  function onCancel() {
    setShelfGenres([]);
    setShelf([]);
    setShelfTitle('');
    setShelfDescription('');
    props.history.goBack();
  }

  async function saveShelf() {
    if (user && user._id && postAuthorUserInfo) {
      setSavingShelf(true);
      const postContent: PostContent = {
        postType: 'shelf',
        shelf,
        title: shelfTitle,
        genres: shelfGenres,
        description: shelfDescription,
      };
      const editShelfRes = await editPost(postContent, postId);
      const { data } = editShelfRes;
      if (data) {
        setSavingShelf(false);
        setSavedShelf(true);
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
            inheritSearchedBooks={shelf}
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
            value={shelfTitle}
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
            value={shelfDescription}
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
            {!savingShelf && (
              <Button
                variant="contained"
                disabled={!readyToPost}
                onClick={saveShelf}
                color="secondary"
              >
                SAVE
              </Button>
            )}
            {savingShelf && <CircularProgress />}
          </div>
        </div>
      </Container>
    </>
  );
}
