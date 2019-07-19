import {
  makeStyles,
  Menu,
  MenuItem,
  Button,
  Typography,
} from '@material-ui/core';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { User, Services } from '@caravan/buddy-reading-types';
import { washedTheme } from '../theme';
import DiscordLoginModal from './DiscordLoginModal';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles(theme => ({
  headerAvatar: {
    width: 48,
    height: 48,
  },
  headerArrowDown: {
    height: 20,
    width: 20,
  },
  profileIconCircle: {
    backgroundColor: washedTheme.palette.primary.main,
  },
  button: {
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

interface InviteToClubMenuProps {
  clubsToInviteTo: Services.GetClubs['clubs'];
}

export function InviteToClubMenu(props: InviteToClubMenuProps) {
  const classes = useStyles();

  const { clubsToInviteTo } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const inviteMenuOpen = Boolean(anchorEl);

  const [loginModalShown, setLoginModalShown] = React.useState(false);

  function onCloseLoginModal() {
    setLoginModalShown(false);
  }

  function handleInviteMenuClose(event: React.MouseEvent<EventTarget>) {
    setAnchorEl(null);
  }

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  return (
    <>
      <Button
        className={classes.button}
        color="primary"
        variant="contained"
        onClick={handleClick}
        disabled={clubsToInviteTo.length === 0}
      >
        <Typography variant="button">Invite to Club</Typography>
      </Button>
      <Menu
        open={inviteMenuOpen}
        anchorEl={anchorEl}
        onClose={handleInviteMenuClose}
        TransitionComponent={Fade}
      >
        {clubsToInviteTo.map(club => (
          <MenuItem>{club.name}</MenuItem>
        ))}
      </Menu>
    </>
  );
}
