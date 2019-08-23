import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  makeStyles,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Like, PostUserInfo } from '@caravan/buddy-reading-types';
import PostLikesThumbnails from './PostLikesThumbnails';

const useStyles = makeStyles(theme => ({
  actionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  likesContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  heartIcon: {
    padding: 4,
  },
  likeButton: {
    height: 30,
    width: 30,
  },
  createClubButtonContainer: {
    padding: theme.spacing(1),
  },
  createClubButton: {
    textTransform: 'none',
  },
}));

interface PostActionsProps {
  postId: string;
  likes: PostUserInfo[];
  hasLiked: boolean | null;
  currUserId: string;
  onClickLike: () => void;
  likeButtonDisabled: boolean;
}

function PostActions(props: PostActionsProps) {
  const classes = useStyles();
  const theme = useTheme();
  const {
    postId,
    likes,
    currUserId,
    onClickLike,
    hasLiked,
    likeButtonDisabled,
  } = props;
  const screenSmallerThanSm = useMediaQuery(theme.breakpoints.down('xs'));

  const maxLikeThumbnailsShown = screenSmallerThanSm ? 1 : 3;

  return (
    <div className={classes.actionContainer}>
      <div className={classes.likesContainer}>
        <IconButton
          onClick={() => onClickLike()}
          classes={{ root: classes.heartIcon }}
          disabled={likeButtonDisabled}
        >
          <FavoriteIcon
            className={classes.likeButton}
            style={{
              fill: hasLiked ? '#AF0020' : undefined,
            }}
          />
        </IconButton>
        <PostLikesThumbnails likes={likes} maxShown={maxLikeThumbnailsShown} />
      </div>
      <div className={classes.createClubButtonContainer}>
        <Button
          className={classes.createClubButton}
          variant="contained"
          color="primary"
        >
          <Typography variant="subtitle1">Create club from shelf</Typography>
        </Button>
      </div>
    </div>
  );
}

export default PostActions;
