import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import {
  FilterAutoMongoKeys,
  PostUserInfo,
  SelectedGenre,
  ShelfEntry,
  User,
} from '@caravanapp/types';
import {
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  IconButton,
  makeStyles,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { ArrowBackIos as BackIcon } from '@material-ui/icons';

import CustomSnackbar, {
  CustomSnackbarProps,
} from '../../components/CustomSnackbar';
import DeletePostDialog from '../../components/DeletePostDialog';
import GenresInCommonChips from '../../components/GenresInCommonChips';
import Header from '../../components/Header';
import shelfIcon from '../../resources/post-icons/shelf_icon.svg';
import { modifyPostLike } from '../../services/like';
import {
  deletePost,
  getPostWithAuthorAndLikesUserInfo,
} from '../../services/post';
import theme from '../../theme';
import PostActions from './PostActions';
import PostHeader from './PostHeader';
import ShelfPostCardShelfList from './ShelfPostCardShelfList';

const useStyles = makeStyles(theme => ({
  cardGrid: {
    padding: `${theme.spacing(4)}px 16px ${theme.spacing(8)}px`,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  shelfTitle: {
    fontWeight: 600,
    marginTop: theme.spacing(2.5),
  },
  shelfDescription: {},
  cardContent: {
    position: 'relative',
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    padding: '16px 16px 0px',
  },
  cardActions: {},
  genresInCommon: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  notFoundContainer: {
    padding: theme.spacing(4),
  },
}));

interface ViewShelfRouteParams {
  id: string;
}

interface PostProps extends RouteComponentProps<ViewShelfRouteParams> {
  user: User | null;
}

export default function Post(props: PostProps) {
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
  const [
    feedViewerUserInfo,
    setFeedViewerUserInfo,
  ] = React.useState<PostUserInfo | null>(null);
  const [shelfGenres, setShelfGenres] = React.useState<SelectedGenre[]>([]);
  const [shelfTitle, setShelfTitle] = React.useState<string>('');
  const [postDate, setPostDate] = React.useState<string | Date | undefined>(
    undefined
  );
  const [shelfDescription, setShelfDescription] = React.useState<string>('');
  const [shouldExecuteLike, setShouldExecuteLike] = React.useState<boolean>(
    false
  );
  const [loadedPost, setLoadedPost] = React.useState<boolean>(false);

  const [hasLiked, setHasLiked] = React.useState<boolean>(false);

  const [postLikes, setPostLikes] = React.useState<PostUserInfo[]>([]);

  const [postNumLikes, setPostNumLikes] = React.useState<number>(0);

  const [deletePostDialogVisible, setDeletePostDialogVisible] = React.useState<
    boolean
  >(false);

  const [snackbarProps, setSnackbarProps] = React.useState<CustomSnackbarProps>(
    {
      autoHideDuration: 6000,
      isOpen: false,
      handleClose: onSnackbarClose,
      variant: 'success',
    }
  );

  const screenSmallerThanMd = useMediaQuery(theme.breakpoints.down('sm'));

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
      <BackIcon />
    </IconButton>
  );

  const centerComponent =
    shelfTitle && postAuthorUserInfo !== null && postAuthorUserInfo.name ? (
      <Typography
        variant="h5"
        color="textPrimary"
        style={{ textAlign: 'center' }}
      >
        {`"${shelfTitle}" Shelf by ${postAuthorUserInfo.name}`}
      </Typography>
    ) : (
      <Typography
        variant="h5"
        color="textPrimary"
        style={{ textAlign: 'center' }}
      >
        Shelf Post
      </Typography>
    );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const getPost = async () => {
      try {
        const postTransformedRes = await getPostWithAuthorAndLikesUserInfo(
          postId
        );
        if (
          postTransformedRes.status >= 200 &&
          postTransformedRes.status < 300
        ) {
          const postTransformed = postTransformedRes.data;
          const {
            post,
            authorInfo,
            likes,
            likeUserIds,
            numLikes,
          } = postTransformed;
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
            if (post.createdAt) {
              setPostDate(post.createdAt);
            }
          }
          if (authorInfo) {
            setPostAuthorUserInfo(authorInfo);
          }
          if (likes) {
            setPostLikes(likes);
          }
          if (likeUserIds && user && user._id) {
            setHasLiked(likeUserIds.includes(user._id));
          }
          if (numLikes) {
            setPostNumLikes(numLikes);
          }
          setLoadedPost(true);
        }
      } catch (err) {
        setLoadedPost(true);
        console.error(err);
      }
    };
    getPost();
  }, [postId, user]);

  useEffect(() => {
    (async () => {
      if (
        user &&
        user._id &&
        user.name &&
        user.urlSlug &&
        user.discordId &&
        user.photoUrl
      ) {
        setFeedViewerUserInfo({
          userId: user._id,
          name: user.name,
          urlSlug: user.urlSlug,
          discordId: user.discordId,
          photoUrl: user.photoUrl,
        });
      }
    })();
  }, [user]);

  useEffect(() => {
    if (shouldExecuteLike && user) {
      modifyPostLike(postId, hasLiked ? 'like' : 'unlike');
    }
  }, [hasLiked, postId, shouldExecuteLike, user]);

  if (loadedPost && shelf.length === 0) {
    return (
      <>
        <Header
          leftComponent={leftComponent}
          centerComponent={centerComponent}
        />
        <Container maxWidth="md" className={classes.notFoundContainer}>
          <Typography>
            Whoops! It doesn't look like this post exists!
          </Typography>
        </Container>
      </>
    );
  }

  async function handleLikeAction() {
    if (user && feedViewerUserInfo !== null) {
      if (!shouldExecuteLike) {
        setShouldExecuteLike(true);
      }
      if (hasLiked) {
        const updatedLikesArr = postLikes.filter(l => l.userId !== user._id);
        setPostLikes(updatedLikesArr);
        setPostNumLikes(updatedLikesArr.length);
      } else {
        const updatedLikesArr = [...postLikes, feedViewerUserInfo];
        setPostLikes(updatedLikesArr);
        setPostNumLikes(updatedLikesArr.length);
      }
      setHasLiked(!hasLiked);
    }
  }

  async function onDeletePost() {
    const res = await deletePost(postId);
    if (res && res.status && res.status >= 200 && res.status < 300) {
      setDeletePostDialogVisible(false);
      if (props.history.length > 2) {
        props.history.goBack();
      } else {
        props.history.replace('/');
      }
    } else {
      setDeletePostDialogVisible(false);
      // post not deleted successfully
      setSnackbarProps(s => ({
        ...s,
        isOpen: true,
        variant: 'warning',
        message:
          'Whoops! Something has gone wrong and we were unable to delete your post. Refresh, log in and out, then message the Caravan team if this continues.',
      }));
      return;
    }
  }

  function onSnackbarClose() {
    setSnackbarProps({ ...snackbarProps, isOpen: false });
  }

  function onSharePost() {
    setSnackbarProps({
      ...snackbarProps,
      isOpen: true,
      variant: 'info',
      message: screenSmallerThanMd
        ? 'Copied shelf link to clipboard!'
        : 'Copied shelf link to clipboard. Share this shelf with the world!',
    });
  }

  let myGenres: string[] = [];
  if (user) {
    myGenres = user.selectedGenres.map(x => x.name);
  }
  let nonSharedShelfGenres: string[] = [];
  let commonGenres: string[] = [];
  let shelfGenreNames: string[] = [];
  if (shelfGenres && shelfGenres.length > 0) {
    shelfGenreNames = shelfGenres.map(g => g.name);
    commonGenres = shelfGenreNames.filter(val => myGenres.includes(val));
    commonGenres = commonGenres.slice(0, Math.min(commonGenres.length, 5));
    if (commonGenres.length < 5) {
      nonSharedShelfGenres = shelfGenreNames.filter(
        val => !myGenres.includes(val)
      );
      nonSharedShelfGenres = nonSharedShelfGenres.slice(
        0,
        Math.min(5 - commonGenres.length, 5)
      );
    }
  }

  return (
    <>
      <Header leftComponent={leftComponent} centerComponent={centerComponent} />
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid item xs={12} sm={12}>
          <Card className={classes.card}>
            {postAuthorUserInfo && postDate && (
              <PostHeader
                postAuthorInfo={postAuthorUserInfo}
                iconColor={'#64B5F6'}
                postIcon={shelfIcon}
                postDate={postDate}
                ownPost={
                  user !== null && user._id === postAuthorUserInfo.userId
                }
                onClickDelete={() => setDeletePostDialogVisible(true)}
                postId={postId}
              />
            )}

            <CardContent classes={{ root: classes.cardContent }}>
              {shelf.length > 0 && <ShelfPostCardShelfList shelf={shelf} />}
              <Typography
                gutterBottom
                variant="h6"
                component="h5"
                className={classes.shelfTitle}
              >
                {shelfTitle}
              </Typography>
              <Typography
                gutterBottom
                variant="subtitle2"
                component="h2"
                className={classes.shelfDescription}
              >
                {shelfDescription}
              </Typography>
              {shelfGenreNames.length > 0 && (
                <div className={classes.genresInCommon}>
                  {commonGenres.map(genre => (
                    <GenresInCommonChips
                      name={genre}
                      backgroundColor={theme.palette.primary.main}
                      common={true}
                      key={genre}
                    />
                  ))}
                  {nonSharedShelfGenres.map(genre => (
                    <GenresInCommonChips
                      name={genre}
                      backgroundColor={theme.palette.primary.main}
                      common={false}
                      key={genre}
                    />
                  ))}
                </div>
              )}
            </CardContent>
            {postAuthorUserInfo && (
              <CardActions className={classes.cardActions}>
                <PostActions
                  likes={postLikes}
                  hasLiked={hasLiked}
                  numLikes={postNumLikes}
                  onClickLike={handleLikeAction}
                  shelf={shelf}
                  shelfName={shelfTitle}
                  shelfGenres={shelfGenres ? shelfGenres : []}
                  shelfAuthorInfo={postAuthorUserInfo}
                  userId={user ? user._id : undefined}
                  onSharePost={onSharePost}
                  postId={postId}
                  currentlyViewing={true}
                />
              </CardActions>
            )}
          </Card>
        </Grid>
      </Container>
      <DeletePostDialog
        open={deletePostDialogVisible}
        onCancel={() => setDeletePostDialogVisible(false)}
        onDelete={onDeletePost}
      />
      <CustomSnackbar {...snackbarProps} />
    </>
  );
}
