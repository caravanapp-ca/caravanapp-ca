import React from 'react';
import {
  makeStyles,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Link,
  ListItemIcon,
  ListItem,
} from '@material-ui/core';
import { PostUserInfo } from '@caravan/buddy-reading-types';

const useStyles = makeStyles(theme => ({
  viewInvitesText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    width: 30,
    height: 30,
    marginRight: -4,
  },
  thumbnailAvatar: {
    width: 48,
    height: 48,
  },
  likedByMenuItem: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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

interface CreateClubFromShelfInviteListProps {
  likes: PostUserInfo[];
  numLikes: number;
  likeListLength: number;
}

export default function CreateClubFromShelfInviteList(
  props: CreateClubFromShelfInviteListProps
) {
  const classes = useStyles();

  const { likes, numLikes, likeListLength } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const showLikesMenuOpen = Boolean(anchorEl);

  function handleInviteMenuClose() {
    setAnchorEl(null);
  }

  function showLikesMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  return (
    <>
      <Link onClick={showLikesMenu}>
        <div className={classes.viewInvitesText} onClick={showLikesMenu}>
          <Typography>View Invite List</Typography>
        </div>
      </Link>
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
            maxHeight: 216,
          },
        }}
        MenuListProps={{
          style: {
            paddingTop: 0,
            paddingBottom: 0,
          },
        }}
      >
        <ListItem style={{ backgroundColor: 'rgba(0, 0, 0, 0.07)' }}>
          <Typography style={{ fontWeight: 600, color: 'textPrimary' }}>
            Send invites to ({numLikes.toString()})
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
            <Link href={`/user/${l.urlSlug}`} underline="none">
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
        {numLikes > likeListLength && (
          <ListItem style={{ backgroundColor: 'rgba(0, 0, 0, 0.07)' }}>
            <Typography style={{ fontWeight: 600, color: 'textPrimary' }}>
              and {numLikes - likeListLength} more
            </Typography>
          </ListItem>
        )}
      </Menu>
    </>
  );
}
