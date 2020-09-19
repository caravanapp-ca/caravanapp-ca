import copyToClipboard from 'copy-to-clipboard';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import type {
  FilterAutoMongoKeys,
  PostUserInfo,
  SelectedGenre,
  ShelfEntry,
} from '@caravanapp/types';
import {
  Button,
  IconButton,
  Link,
  makeStyles,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { Favorite as FavoriteIcon, Link as LinkIcon } from '@material-ui/icons';

import { getReferralLink } from '../../common/referral';
import AdapterLink from '../../components/AdapterLink';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import PostLikesThumbnails from '../../components/PostLikesThumbnails';

const useStyles = makeStyles(theme => ({
  bottomContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  likesContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: theme.spacing(1),
  },
  heartIcon: {
    padding: 4,
  },
  likeButton: {
    height: 30,
    width: 30,
  },
  shareContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  shareIconButton: {
    padding: 4,
  },
  shareIcon: {
    height: 30,
    width: 30,
  },
  viewPostButton: {
    textTransform: 'none',
  },
  createClubButtonContainer: {
    padding: theme.spacing(1),
  },
  createClubButton: {
    textTransform: 'none',
    marginLeft: 4,
  },
}));

interface PostActionsProps {
  likes: PostUserInfo[];
  hasLiked: boolean | null;
  numLikes: number;
  onClickLike: () => void;
  shelf: FilterAutoMongoKeys<ShelfEntry>[];
  shelfName: string;
  shelfGenres: SelectedGenre[];
  shelfAuthorInfo: PostUserInfo;
  userId: string | undefined;
  onSharePost: () => void;
  postId: string;
  currentlyViewing: boolean;
}

function PostActions(props: PostActionsProps) {
  const classes = useStyles();
  const theme = useTheme();
  const {
    likes,
    onClickLike,
    hasLiked,
    numLikes,
    shelf,
    shelfName,
    shelfGenres,
    shelfAuthorInfo,
    userId,
    onSharePost,
    postId,
    currentlyViewing,
  } = props;

  const [loginModalShown, setLoginModalShown] = React.useState(false);

  const screenSmallerThanSm = useMediaQuery(theme.breakpoints.down('xs'));

  const maxLikeThumbnailsShown = screenSmallerThanSm ? 1 : 5;

  const likeListLength = 10;

  function onCloseLoginModal() {
    setLoginModalShown(false);
  }

  function handleLike() {
    if (userId) {
      onClickLike();
    } else {
      setLoginModalShown(true);
    }
  }

  function copyShelfLink() {
    copyToClipboard(getReferralLink(userId, 'post', undefined, postId));
    onSharePost();
  }

  return (
    <div className={classes.bottomContainer}>
      <div className={classes.actionContainer}>
        <IconButton onClick={handleLike} classes={{ root: classes.heartIcon }}>
          <FavoriteIcon
            className={classes.likeButton}
            style={{
              fill: hasLiked ? '#AF0020' : undefined,
            }}
          />
        </IconButton>
        {numLikes > 0 && (
          <div className={classes.likesContainer}>
            <PostLikesThumbnails
              likes={likes}
              numLikes={numLikes}
              maxShown={maxLikeThumbnailsShown}
              likeListLength={likeListLength}
            />
          </div>
        )}
        <div className={classes.shareContainer}>
          <IconButton
            onClick={copyShelfLink}
            classes={{ root: classes.shareIconButton }}
          >
            <LinkIcon className={classes.shareIcon} />
          </IconButton>
        </div>
      </div>
      <div className={classes.createClubButtonContainer}>
        {!currentlyViewing && (
          <Button
            color="primary"
            className={classes.viewPostButton}
            component={AdapterLink}
            to={`/posts/${postId}`}
          >
            <Typography variant="subtitle2">View</Typography>
          </Button>
        )}
        {userId && (
          <Link
            component={RouterLink}
            to={{
              pathname: '/clubs/create',
              state: {
                shelf: shelf,
                // If its their own post, or they've liked it, we want to remove them from the invites list.
                // If its someone elses post, but that person liked their own post, we don't need to send the author an invite
                // If its someone elses post, and that person hasn't liked their own post, we need to send the author an invite
                invites:
                  shelfAuthorInfo.userId === userId || hasLiked
                    ? likes.filter(l => l.userId !== userId)
                    : likes.map(l => l.userId).includes(shelfAuthorInfo.userId)
                    ? likes
                    : [shelfAuthorInfo, ...likes],
                inviteListLength: likeListLength,
                shelfName,
                shelfGenres,
                shelfAuthorName: shelfAuthorInfo.name,
              },
            }}
            underline="none"
          >
            <Button
              className={classes.createClubButton}
              variant="contained"
              color="primary"
            >
              {screenSmallerThanSm && !currentlyViewing && (
                <Tooltip
                  title="This will create a club with this shelf as the launching point"
                  aria-label="This will create a club with this shelf as the launching point"
                >
                  <Typography variant="subtitle2">Create club</Typography>
                </Tooltip>
              )}
              {(!screenSmallerThanSm || currentlyViewing) && (
                <Tooltip
                  title="This will create a club with this shelf as the launching point"
                  aria-label="This will create a club with this shelf as the launching point"
                >
                  <Typography variant="subtitle2">
                    Create club from shelf
                  </Typography>
                </Tooltip>
              )}
            </Button>
          </Link>
        )}
        {!userId && (
          <Button
            className={classes.createClubButton}
            variant="contained"
            color="primary"
            onClick={() => setLoginModalShown(true)}
          >
            {screenSmallerThanSm && !currentlyViewing && (
              <Typography variant="subtitle2">Create club</Typography>
            )}
            {(!screenSmallerThanSm || currentlyViewing) && (
              <Typography variant="subtitle2">
                Create club from shelf
              </Typography>
            )}
          </Button>
        )}
      </div>
      <DiscordLoginModal
        onCloseLoginDialog={onCloseLoginModal}
        open={loginModalShown}
      />
    </div>
  );
}

export default PostActions;
