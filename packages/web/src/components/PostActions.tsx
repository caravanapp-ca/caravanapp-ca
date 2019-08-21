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
  hasLikedPost: boolean;
  onClickLike: () => void;
}

function PostActions(props: PostActionsProps) {
  const classes = useStyles();

  const { postId, likes, hasLikedPost, onClickLike } = props;

  console.log('Likes in post actions');
  console.log(likes);

  const numLikes = likes.length.toString();

  return (
    <div className={classes.actionContainer}>
      <div className={classes.likesContainer}>
        <IconButton onClick={() => onClickLike()}>
          <FavoriteIcon
            className={classes.likeButton}
            style={{ fill: hasLikedPost ? '#AF0020' : undefined }}
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
