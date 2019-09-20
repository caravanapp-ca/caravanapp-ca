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
  Button,
} from '@material-ui/core';
import { PostUserInfo } from '@caravan/buddy-reading-types';

const useStyles = makeStyles(theme => ({
  viewInvitesDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewInvitesButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'none',
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
  invites: PostUserInfo[];
  numInvites: number;
  inviteListLength: number;
}

export default function CreateClubFromShelfInviteList(
  props: CreateClubFromShelfInviteListProps
) {
  const classes = useStyles();

  const { invites, numInvites, inviteListLength } = props;

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
      <div className={classes.viewInvitesDiv}>
        <Button
          className={classes.viewInvitesButton}
          onClick={showLikesMenu}
          color="primary"
        >
          <Typography>View Invite List</Typography>
        </Button>
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
            Send invites to ({numInvites.toString()})
          </Typography>
        </ListItem>
        {invites.map(i => (
          <MenuItem className={classes.likedByMenuItem} key={i.userId}>
            <Link href={`/user/${i.urlSlug}`}>
              <ListItemIcon>
                <Avatar
                  alt={i.name}
                  src={i.photoUrl}
                  className={classes.thumbnailAvatar}
                />
              </ListItemIcon>
            </Link>
            <Link href={`/user/${i.urlSlug}`} underline="none">
              <Typography
                className={classes.likedByNameText}
                color="textPrimary"
              >
                {i.name}
              </Typography>
              <Typography className={classes.likedByUrlSlugText}>
                @{i.urlSlug}
              </Typography>
            </Link>
          </MenuItem>
        ))}
        {numInvites > inviteListLength && (
          <ListItem style={{ backgroundColor: 'rgba(0, 0, 0, 0.07)' }}>
            <Typography style={{ fontWeight: 600, color: 'textPrimary' }}>
              and {numInvites - inviteListLength} more
            </Typography>
          </ListItem>
        )}
      </Menu>
    </>
  );
}
