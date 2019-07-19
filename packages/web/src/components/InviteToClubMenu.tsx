import {
  makeStyles,
  Menu,
  MenuItem,
  Button,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { User, Services } from '@caravan/buddy-reading-types';
import { washedTheme } from '../theme';
import DiscordLoginModal from './DiscordLoginModal';
import Fade from '@material-ui/core/Fade';
import CustomSnackbar, {
  CustomSnackbarProps,
} from '../components/CustomSnackbar';
import { UserWithInvitableClubs } from '../views/home/Home';
import { inviteToClub } from '../services/club';

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
  loggedInUser: User | null;
  userToInvite: UserWithInvitableClubs;
}

export function InviteToClubMenu(props: InviteToClubMenuProps) {
  const classes = useStyles();

  const { clubsToInviteTo, loggedInUser, userToInvite } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const inviteMenuOpen = Boolean(anchorEl);

  const [loginModalShown, setLoginModalShown] = React.useState(false);

  const [snackbarProps, setSnackbarProps] = React.useState<CustomSnackbarProps>(
    {
      autoHideDuration: 6000,
      isOpen: false,
      handleClose: onSnackbarClose,
      variant: 'success',
    }
  );

  function onCloseLoginModal() {
    setLoginModalShown(false);
  }

  function handleInviteMenuClose(event: React.MouseEvent<EventTarget>) {
    setAnchorEl(null);
  }

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    if (loggedInUser) {
      setAnchorEl(event.currentTarget);
    } else {
      setLoginModalShown(true);
    }
  }

  function onSnackbarClose() {
    setSnackbarProps({ ...snackbarProps, isOpen: false });
  }

  async function handleInviteToClub(club: Services.GetClubs['clubs'][0]) {
    if (loggedInUser) {
      const res = await inviteToClub(
        loggedInUser,
        userToInvite,
        club.name,
        club._id
      );
      if (res.status === 200) {
        setSnackbarProps({
          ...snackbarProps,
          isOpen: true,
          variant: 'success',
          message: 'Successfully invited to club!',
        });
      } else {
        // TODO: determine routing based on other values of res
        setSnackbarProps({
          ...snackbarProps,
          isOpen: true,
          variant: 'warning',
          message: 'We ran into some trouble inviting to club.',
        });
      }
      setAnchorEl(null);
    } else {
      setLoginModalShown(true);
    }
  }

  return (
    <>
      <Button
        className={classes.button}
        color="primary"
        variant="contained"
        onClick={handleClick}
        disabled={!!(clubsToInviteTo.length === 0 && loggedInUser)}
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
          <MenuItem onClick={() => handleInviteToClub(club)}>
            {club.name}
          </MenuItem>
        ))}
      </Menu>
      <CustomSnackbar {...snackbarProps} />
      <DiscordLoginModal
        onCloseLoginDialog={onCloseLoginModal}
        open={loginModalShown}
      />
    </>
  );
}
