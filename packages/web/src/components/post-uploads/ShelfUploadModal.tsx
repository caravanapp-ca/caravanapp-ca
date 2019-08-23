import React, { useEffect } from 'react';
import {
  Services,
  FilterAutoMongoKeys,
  ShelfEntry,
  SelectedGenre,
  PostContent,
  PostWithAuthorInfoAndLikes,
  Post,
  PostUserInfo,
} from '@caravan/buddy-reading-types';
import {
  Dialog,
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  Slide,
  Container,
  TextField,
  CircularProgress,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import GenreChip from '../../components/GenreChip';
import { TransitionProps } from 'react-transition-group/Transition';
import BookSearch from '../../views/books/BookSearch';
import { uploadPost } from '../../services/post';
import { DialogProps } from '@material-ui/core/Dialog';
import { getAllGenres } from '../../services/genre';

const useStyles = makeStyles(theme => ({
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

interface ShelfUploadModalProps {
  smallScreen: boolean;
  open: boolean;
  handleClose: () => void;
  onPostShelf: (
    postType: string,
    postTransformedObj: PostWithAuthorInfoAndLikes
  ) => void;
  userId: string | null;
  postAuthorUserInfo: PostUserInfo | null;
}

const TransitionAction = React.forwardRef<unknown, TransitionProps>(
  function TransitionFcn(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

export default function ShelfUploadModal(props: ShelfUploadModalProps) {
  const classes = useStyles();
  const {
    smallScreen,
    open,
    handleClose,
    userId,
    onPostShelf,
    postAuthorUserInfo,
  } = props;
  const [maxWidth] = React.useState<DialogProps['maxWidth']>('lg');
  const [scroll] = React.useState<DialogProps['scroll']>('paper');
  const [shelf, setShelf] = React.useState<FilterAutoMongoKeys<ShelfEntry>[]>(
    []
  );
  const [genres, setGenres] = React.useState<Services.GetGenres | null>(null);
  const [shelfGenres, setShelfGenres] = React.useState<SelectedGenre[]>([]);
  const [shelfTitle, setShelfTitle] = React.useState<string>('');
  const [shelfDescription, setShelfDescription] = React.useState<string>('');
  const [postingShelf, setPostingShelf] = React.useState(false);

  const readyToPost =
    shelf.length > 1 && shelfTitle.length > 1 && shelfGenres.length > 1;

  useEffect(() => {
    getGenres();
  }, []);

  function onSubmitSelectedBooks(
    selectedBooks: FilterAutoMongoKeys<ShelfEntry>[]
  ) {
    setShelf(selectedBooks);
  }

  function onCloseModal() {
    handleClose();
    setShelfGenres([]);
    setShelf([]);
    setShelfTitle('');
    setShelfDescription('');
  }

  async function postShelf() {
    if (userId && postAuthorUserInfo) {
      const postContent: PostContent = {
        postType: 'shelf',
        shelf,
        title: shelfTitle,
        genres: shelfGenres,
        description: shelfDescription,
      };
      setPostingShelf(true);
      const uploadShelfRes = await uploadPost(postContent, userId);
      const { data } = uploadShelfRes;
      if (data) {
        const postReturned: Post = data.post;
        const postTransformedObj: PostWithAuthorInfoAndLikes = {
          post: postReturned,
          authorInfo: postAuthorUserInfo,
          likes: [],
          numLikes: 0,
        };
        setPostingShelf(false);
        onPostShelf('shelf', postTransformedObj);
        onCloseModal();
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

  return (
    <div>
      <Dialog
        fullScreen={smallScreen}
        fullWidth={!smallScreen}
        maxWidth={maxWidth}
        open={open}
        onClose={onCloseModal}
        // @ts-ignore
        TransitionComponent={TransitionAction}
        scroll={scroll}
      >
        <AppBar className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Button color="inherit" onClick={onCloseModal}>
              Cancel
            </Button>
            <Typography variant="h6">Upload Shelf</Typography>
            <Button color="inherit" disabled={!readyToPost} onClick={postShelf}>
              Post
            </Button>
          </Toolbar>
        </AppBar>
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
                    small={smallScreen}
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
      </Dialog>
    </div>
  );
}
