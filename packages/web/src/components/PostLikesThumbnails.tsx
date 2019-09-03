import React from 'react';
import {
  makeStyles,
  Typography,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Link,
  ListItemIcon,
  ListItem,
} from '@material-ui/core';
import { PostUserInfo } from '@caravan/buddy-reading-types';
import shuffleArr from '../common/shuffleArr';

const useStyles = makeStyles(theme => ({
  likeThumbnails: {
    display: 'flex',
  },
  thumbnail: {
    width: 30,
    height: 30,
    marginRight: 4,
  },
  thumbnailAvatar: {
    width: 48,
    height: 48,
  },
  likedByMenuItem: {
    display: 'flex',
  },
  menuItemTop: {
    paddingTop: 0,
  },
  likedByNameText: {
    textDecoration: 'none',
    fontWeight: 600,
  },
  likedByUrlSlugText: {
    textDecoration: 'none',
  },
}));

interface PostLikesThumbnailsProps {
  likes: PostUserInfo[];
  maxShown: number;
}

function PostLikesThumbnails(props: PostLikesThumbnailsProps) {
  const classes = useStyles();

  const { likes, maxShown } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const showLikesMenuOpen = Boolean(anchorEl);

  function handleInviteMenuClose() {
    setAnchorEl(null);
  }

  function showLikesMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  const slicedLikes = likes.slice(0, maxShown);

  return (
    <>
      <div className={classes.likeThumbnails} onClick={showLikesMenu}>
        {slicedLikes.map(l => {
          return (
            <Tooltip title={l.name} aria-label={l.name} key={l.userId}>
              <Avatar
                alt={l.name}
                src={l.photoUrl}
                className={classes.thumbnail}
              />
            </Tooltip>
          );
        })}
      </div>
      <Menu
        open={showLikesMenuOpen}
        anchorEl={anchorEl}
        onClose={handleInviteMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: 200,
          },
        }}
        MenuListProps={{
          style: {
            paddingTop: 0,
          },
        }}
      >
        <ListItem style={{ backgroundColor: '#F7F7F7' }}>
          <Typography style={{ fontWeight: 600, color: 'textPrimary' }}>
            Shelf liked by ({likes.length.toString()})
          </Typography>
        </ListItem>
        {likes.map(l => (
          <MenuItem className={classes.likedByMenuItem} key={l.userId}>
            <Link href={`/user/${l.urlSlug}`}>
              <ListItemIcon>
                <Avatar
                  alt={l.name}
                  src={l.photoUrl}
                  className={classes.thumbnailAvatar}
                />
              </ListItemIcon>
            </Link>
            <Link href={`/user/${l.urlSlug}`}>
              <Typography
                className={classes.likedByNameText}
                color="textPrimary"
              >
                {l.name}
              </Typography>
              <Typography className={classes.likedByUrlSlugText}>
                @{l.urlSlug}
              </Typography>
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default PostLikesThumbnails;
