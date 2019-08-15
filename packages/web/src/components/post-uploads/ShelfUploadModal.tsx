import React from 'react';
import {
  Services,
  FilterChip,
  FilterAutoMongoKeys,
  ShelfEntry,
  ShelfPost,
  Post,
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

interface ShelfUploadModalProps {
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

export default function ShelfUploadModal(props: ShelfUploadModalProps) {
  const classes = useStyles();
  const { smallScreen, open, handleClose, userId } = props;
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('lg');
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const [draggingElementId, setDraggingElementId] = React.useState<
    string | undefined
  >(undefined);
  const [shelf, setShelf] = React.useState<FilterAutoMongoKeys<ShelfEntry>[]>(
    []
  );
  const [shelfTitle, setShelfTitle] = React.useState<string>('');
  const [shelfDescription, setShelfDescription] = React.useState<string>('');

  const readyToPost = shelf.length > 0 && shelfTitle.length > 0;
  function onSubmitSelectedBooks(
    selectedBooks: FilterAutoMongoKeys<ShelfEntry>[]
  ) {
    setShelf(selectedBooks);
  }

  function onCloseModal() {
    handleClose();
    setShelf([]);
    setShelfTitle('');
    setShelfDescription('');
  }

  async function postShelf() {
    if (userId) {
      const postContent: FilterAutoMongoKeys<Post> = {
        userId,
        content: {
          postType: 'shelf',
          shelf,
          title: shelfTitle,
          description: shelfDescription,
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
            <Typography variant="h6">Upload Shelf</Typography>
            <Button color="inherit" disabled={!readyToPost} onClick={postShelf}>
              Post
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" className={classes.dialogContent}>
          <div className={classes.sectionContainer}>
            <Typography variant="h6" gutterBottom>
              Add books *
            </Typography>
            <BookSearch
              onSubmitBooks={onSubmitSelectedBooks}
              maxSelected={9}
              secondary="delete"
            />
          </div>
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
        </Container>
      </Dialog>
    </div>
  );
}
