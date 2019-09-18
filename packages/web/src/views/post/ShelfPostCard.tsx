import React, { useEffect } from 'react';
import { CardActions } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {
  ShelfPost,
  PostUserInfo,
  PostContent,
  User,
} from '@caravan/buddy-reading-types';
import theme from '../../theme';
import ShelfPostCardShelfList from './ShelfPostCardShelfList';
import PostHeader from './PostHeader';
import shelfIcon from '../../resources/post-icons/shelf_icon.svg';
import PostActions from './PostActions';
import GenresInCommonChips from '../../components/GenresInCommonChips';
import { modifyPostLike } from '../../services/like';
import DeletePostDialog from '../../components/DeletePostDialog';
import { deletePost } from '../../services/post';
import { CustomSnackbarProps } from '../../components/CustomSnackbar';

const useStyles = makeStyles(theme => ({
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
  iconWithLabel: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLabel: {
    marginLeft: 8,
  },
  iconRoot: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardActions: {},
  button: {
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  userHeading: {
    position: 'relative',
    height: '96px',
    width: '100%',
  },
  userNameText: {
    fontWeight: 600,
  },
  userWebsiteText: {},
  fieldTitleText: {
    marginTop: theme.spacing(3),
  },
  genresInCommon: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  emptyFieldText: {
    fontStyle: 'italic',
  },
  progress: {
    margin: theme.spacing(2),
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

interface ShelfPostCardProps {
  postContent: PostContent;
  postAuthorInfo: PostUserInfo;
  postDate: string | Date;
  feedViewerUserInfo: PostUserInfo | null;
  likes: PostUserInfo[];
  likeUserIds: string[];
  numLikes: number;
  postId: string;
  currUser: User | null;
  onSharePost: () => void;
}

export default function ShelfPostCard(props: ShelfPostCardProps) {
  const classes = useStyles();
  const {
    postContent,
    postAuthorInfo,
    postDate,
    feedViewerUserInfo,
    likes,
    likeUserIds,
    numLikes,
    postId,
    currUser,
    onSharePost,
  } = props;
  const shelfPost = postContent as ShelfPost;

  const [shouldExecuteLike, setShouldExecuteLike] = React.useState<boolean>(
    false
  );

  const [hasLiked, setHasLiked] = React.useState<boolean>(
    currUser ? likeUserIds.includes(currUser._id) : false
  );

  const [modifiedLikes, setModifiedLikes] = React.useState<PostUserInfo[]>(
    likes
  );

  const [modifiedNumLikes, setModifiedNumLikes] = React.useState<number>(
    numLikes
  );

  const [likeButtonDisabled, setLikeButtonDisabled] = React.useState<boolean>(
    false
  );

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

  useEffect(() => {
    if (shouldExecuteLike && currUser) {
      modifyPostLike(postId, hasLiked ? 'like' : 'unlike');
    }
  }, [hasLiked, shouldExecuteLike, currUser, postId]);

  async function handleLikeAction() {
    if (currUser && feedViewerUserInfo !== null) {
      if (!shouldExecuteLike) {
        setShouldExecuteLike(true);
      }
      if (hasLiked) {
        const updatedLikesArr = modifiedLikes.filter(
          l => l.userId !== currUser._id
        );
        setModifiedLikes(updatedLikesArr);
        setModifiedNumLikes(updatedLikesArr.length);
      } else {
        const updatedLikesArr = [...modifiedLikes, feedViewerUserInfo];
        setModifiedLikes(updatedLikesArr);
        setModifiedNumLikes(updatedLikesArr.length);
      }
      setHasLiked(!hasLiked);
      setTimeout(() => setLikeButtonDisabled(false), 5000);
    }
  }

  async function onDeletePost() {
    const res = await deletePost(postId);
    if (res && res.status && res.status >= 200 && res.status < 300) {
      setDeletePostDialogVisible(false);
      window.location.reload();
    } else {
      setDeletePostDialogVisible(false);
      return;
    }
  }

  function onSnackbarClose() {
    setSnackbarProps({ ...snackbarProps, isOpen: false });
  }

  let myGenres: string[] = [];
  if (currUser) {
    myGenres = currUser.selectedGenres.map(x => x.name);
  }
  let shelfGenres: string[] = [];
  let nonSharedShelfGenres: string[] = [];
  let commonGenres: string[] = [];
  if (shelfPost && shelfPost.genres && shelfPost.genres.length > 0) {
    shelfGenres = shelfPost.genres.map(g => g.name);
    commonGenres = shelfGenres.filter(val => myGenres.includes(val));
    commonGenres = commonGenres.slice(0, Math.min(commonGenres.length, 5));
    if (commonGenres.length < 5) {
      nonSharedShelfGenres = shelfGenres.filter(val => !myGenres.includes(val));
      nonSharedShelfGenres = nonSharedShelfGenres.slice(
        0,
        Math.min(5 - commonGenres.length, 5)
      );
    }
  }

  return (
    <>
      <Card className={classes.card}>
        <PostHeader
          postAuthorInfo={postAuthorInfo}
          iconColor={'#64B5F6'}
          postIcon={shelfIcon}
          postDate={postDate}
          ownPost={currUser !== null && currUser._id === postAuthorInfo.userId}
          onClickDelete={() => setDeletePostDialogVisible(true)}
          postId={postId}
        />
        <CardContent classes={{ root: classes.cardContent }}>
          {shelfPost.shelf.length > 0 && (
            <ShelfPostCardShelfList shelf={shelfPost.shelf} />
          )}
          <Typography
            gutterBottom
            variant="h6"
            component="h5"
            className={classes.shelfTitle}
          >
            {shelfPost.title}
          </Typography>
          <Typography
            gutterBottom
            variant="subtitle2"
            component="h2"
            className={classes.shelfDescription}
          >
            {shelfPost.description}
          </Typography>
          {shelfGenres.length > 0 && (
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
        <CardActions className={classes.cardActions}>
          <PostActions
            likes={modifiedLikes}
            hasLiked={hasLiked}
            numLikes={modifiedNumLikes}
            onClickLike={handleLikeAction}
            likeButtonDisabled={likeButtonDisabled}
            shelf={shelfPost.shelf}
            shelfName={shelfPost.title}
            shelfGenres={shelfPost.genres ? shelfPost.genres : []}
            shelfAuthorInfo={postAuthorInfo}
            userId={currUser ? currUser._id : undefined}
            onSharePost={onSharePost}
            postId={postId}
            currentlyViewing={false}
          />
        </CardActions>
      </Card>
      <DeletePostDialog
        open={deletePostDialogVisible}
        onCancel={() => setDeletePostDialogVisible(false)}
        onDelete={onDeletePost}
      />
    </>
  );
}
