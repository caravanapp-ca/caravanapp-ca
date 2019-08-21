import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { makeStyles, Button, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Like, PostUserInfo } from '@caravan/buddy-reading-types';

const useStyles = makeStyles(theme => ({
  actionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  likesContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
  currUserId: string;
  onClickLike: () => void;
  hasLiked: boolean | null;
  modifiedLikes: PostUserInfo[] | null;
}

function PostActions(props: PostActionsProps) {
  const classes = useStyles();

  const {
    postId,
    likes,
    currUserId,
    onClickLike,
    hasLiked,
    modifiedLikes,
  } = props;

  console.log('Likes in post actions');
  console.log(likes);

  let likedUserIds: string[] = [];
  let numLikes: string = '';
  if (modifiedLikes !== null) {
    numLikes = modifiedLikes.length.toString();
    likedUserIds = modifiedLikes.map(l => l.userId);
  } else {
    numLikes = likes.length.toString();
    likedUserIds = likes.map(l => l.userId);
  }

  const alreadyLikedBoolean =
    hasLiked !== null ? hasLiked : likedUserIds.includes(currUserId);

  return (
    <div className={classes.actionContainer}>
      <div className={classes.likesContainer}>
        <IconButton onClick={() => onClickLike()}>
          <FavoriteIcon
            className={classes.likeButton}
            style={{
              fill: alreadyLikedBoolean ? '#AF0020' : undefined,
            }}
          />
        </IconButton>
        <Typography>
          {postId} has {numLikes} likes
        </Typography>
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
