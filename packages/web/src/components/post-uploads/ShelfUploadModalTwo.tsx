import React, { useEffect, RefObject } from 'react';
import ReactDOM from 'react-dom';
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from 'body-scroll-lock';
import Backdrop, { BackdropProps } from '@material-ui/core/Backdrop';
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
  useMediaQuery,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import GenreChip from '../../components/GenreChip';
import { TransitionProps } from 'react-transition-group/Transition';
import BookSearch from '../../views/books/BookSearch';
import { uploadPost } from '../../services/post';
import { DialogProps } from '@material-ui/core/Dialog';
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

interface ShelfUploadModalProps {
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

export class BackDropIOSWorkaround extends React.PureComponent<BackdropProps> {
  protected onTouchMove(event: React.TouchEvent<HTMLDivElement>): void {
    event.preventDefault();
  }

  public render(): JSX.Element {
    return <Backdrop {...this.props} onTouchMove={this.onTouchMove} />;
  }
}

function instanceOfValidElement(object: any) {
  if (object instanceof Element) {
    return true;
  } else if (object instanceof HTMLElement) {
    return true;
  } else {
    return false;
  }
}

export default function ShelfUploadModalTwo(props: ShelfUploadModalProps) {
  const classes = useStyles();
  const { open, handleClose, userId, onPostShelf, postAuthorUserInfo } = props;
  const maxWidth = 'lg';
  const scroll = 'paper';
  const [shelf, setShelf] = React.useState<FilterAutoMongoKeys<ShelfEntry>[]>(
    []
  );
  const [genres, setGenres] = React.useState<Services.GetGenres | null>(null);
  const [shelfGenres, setShelfGenres] = React.useState<SelectedGenre[]>([]);
  const [shelfTitle, setShelfTitle] = React.useState<string>('');
  const [shelfDescription, setShelfDescription] = React.useState<string>('');
  const [postingShelf, setPostingShelf] = React.useState(false);

  const readyToPost =
    shelf.length > 1 && shelfTitle.length > 0 && shelfGenres.length > 0;

  const targetRef = React.useRef<HTMLDivElement>(null);
  let targetElement: HTMLElement | Element | null = null;

  useEffect(() => {
    getGenres();
  }, []);

  useEffect(() => {
    if (targetRef.current && open) {
      //@ts-ignore
      targetElement = ReactDOM.findDOMNode(targetRef.current);
      if (targetElement !== null && instanceOfValidElement(targetElement)) {
        enableBodyScroll(targetElement);
      }
    }
  }, [open]);

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
      const uploadShelfRes = await uploadPost(postContent);
      const { data } = uploadShelfRes;
      if (data) {
        const postReturned: Post = data.post;
        const postTransformedObj: PostWithAuthorInfoAndLikes = {
          post: postReturned,
          authorInfo: postAuthorUserInfo,
          likes: [],
          likeUserIds: [],
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

  const screenSmallerThanSm = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <div>
      <Dialog
        fullScreen={screenSmallerThanSm}
        fullWidth={!screenSmallerThanSm}
        BackdropComponent={BackDropIOSWorkaround}
        maxWidth={maxWidth}
        open={open}
        onClose={onCloseModal}
        // @ts-ignore
        TransitionComponent={TransitionAction}
        scroll={scroll}
        className={classes.modal}
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
      </Dialog>
    </div>
  );
}
