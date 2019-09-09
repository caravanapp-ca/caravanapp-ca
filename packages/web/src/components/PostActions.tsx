import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  makeStyles,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  Link,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {
  PostUserInfo,
  FilterAutoMongoKeys,
  ShelfEntry,
  SelectedGenre,
} from '@caravan/buddy-reading-types';
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
  likes: PostUserInfo[];
  likeUserIds: string[];
  hasLiked: boolean | null;
  numLikes: number;
  onClickLike: () => void;
  likeButtonDisabled: boolean;
  shelf: FilterAutoMongoKeys<ShelfEntry>[];
  shelfName: string;
  shelfGenres: SelectedGenre[];
  shelfAuthorName: string;
  userId: string;
}

function PostActions(props: PostActionsProps) {
  const classes = useStyles();
  const theme = useTheme();
  const {
    likes,
    likeUserIds,
    onClickLike,
    hasLiked,
    numLikes,
    likeButtonDisabled,
    shelf,
    shelfName,
    shelfGenres,
    shelfAuthorName,
    userId,
  } = props;
  const screenSmallerThanSm = useMediaQuery(theme.breakpoints.down('xs'));

  const maxLikeThumbnailsShown = screenSmallerThanSm ? 2 : 5;

  const likeListLength = 10;

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
        <PostLikesThumbnails
          likes={likes}
          numLikes={numLikes}
          maxShown={maxLikeThumbnailsShown}
          likeListLength={likeListLength}
        />
      </div>
      <div className={classes.createClubButtonContainer}>
        <Link
          component={RouterLink}
          to={{
            pathname: '/clubs/create',
            state: {
              shelf: shelf,
              numLikes: hasLiked ? numLikes - 1 : numLikes,
              likes: hasLiked ? likes.filter(l => l.userId !== userId) : likes,
              likeUserIds: hasLiked
                ? likeUserIds.filter(l => l !== userId)
                : likeUserIds,
              likeListLength,
              shelfName,
              shelfGenres,
              shelfAuthorName,
            },
          }}
          underline="none"
        >
          <Button
            className={classes.createClubButton}
            variant="contained"
            color="primary"
          >
            <Typography variant="subtitle2">Create club from shelf</Typography>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default PostActions;
