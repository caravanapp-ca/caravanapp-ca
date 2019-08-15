import React from 'react';
import {
  Services,
  FilterChip,
  FilterAutoMongoKeys,
  ShelfEntry,
  ShelfPost,
  Post,
  ProgressUpdateType,
} from '@caravan/buddy-reading-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Container,
  TextField,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import GenreChip from '../../components/GenreChip';
import theme from '../../theme';
import { Transition } from 'react-transition-group';
import { TransitionProps } from 'react-transition-group/Transition';
import BookSearch from '../../views/books/BookSearch';
import { uploadPost } from '../../services/post';
import { DialogProps } from '@material-ui/core/Dialog';

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
}));

interface ProgressUpdateUploadModalProps {
  smallScreen: boolean;
  open: boolean;
  handleClose: () => void;
  userId: string | null;
}

const TransitionAction = React.forwardRef<unknown, TransitionProps>(
  function TransitionFcn(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

export default function ProgressUpdateUploadModal(
  props: ProgressUpdateUploadModalProps
) {
  const classes = useStyles();
  const { smallScreen, open, handleClose, userId } = props;
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('lg');
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const [draggingElementId, setDraggingElementId] = React.useState<
    string | undefined
  >(undefined);
  const [book, setBook] = React.useState<
    FilterAutoMongoKeys<ShelfEntry> | undefined
  >(undefined);
  const [
    progressUpdateDescription,
    setProgressUpdateDescription,
  ] = React.useState<string>('');
  const [progressUpdateType, setProgressUpdateType] = React.useState<
    ProgressUpdateType
  >('starting');
  const readyToPost = book && progressUpdateDescription.length > 0;
  function onSubmitSelectedBooks(
    selectedBook: FilterAutoMongoKeys<ShelfEntry>[]
  ) {
    setBook(selectedBook[0]);
  }

  function onCloseModal() {
    handleClose();
    setBook(undefined);
    setProgressUpdateDescription('');
  }

  async function postProgressUpdate() {
    if (userId && book) {
      const postContent: FilterAutoMongoKeys<Post> = {
        userId,
        content: {
          postType: 'progressUpdate',
          book,
          progressUpdateType,
          containsSpoiler: false,
          description: progressUpdateDescription,
        },
      };
      await uploadPost(postContent);
    }
  }

  return (
    <div>
      <Dialog
        fullScreen={smallScreen}
        fullWidth={!smallScreen}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        // @ts-ignore
        TransitionComponent={TransitionAction}
        scroll={scroll}
      >
        <AppBar className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Button color="inherit" onClick={onCloseModal}>
              Cancel
            </Button>
            <Typography variant="h6">Post Progress Update</Typography>
            <Button
              color="inherit"
              disabled={!readyToPost}
              onClick={postProgressUpdate}
            >
              Post
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" className={classes.dialogContent}>
          <div className={classes.sectionContainer}>
            <Typography variant="h6" gutterBottom>
              Select a Book *
            </Typography>
            <BookSearch
              onSubmitBooks={onSubmitSelectedBooks}
              maxSelected={1}
              secondary="delete"
            />
          </div>
          <div className={classes.sectionContainer}>
            <Typography variant="h6" gutterBottom>
              Talk about it! *
            </Typography>
            <TextField
              id="filled-name"
              label="Progress Update Description"
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
              ) => setProgressUpdateDescription(e.target.value)}
            />
          </div>
        </Container>
      </Dialog>
    </div>
  );
}
