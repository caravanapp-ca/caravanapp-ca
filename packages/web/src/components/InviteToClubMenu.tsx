import React from 'react';

import type { ClubWithMemberIds, Services, User } from '@caravanapp/types';
import {
  Button,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core';

import CustomSnackbar, {
  CustomSnackbarProps,
} from '../components/CustomSnackbar';
import { inviteToClub } from '../services/club';
import { washedTheme } from '../theme';
import DiscordLoginModal from './DiscordLoginModal';

const useStyles = makeStyles((theme: Theme) => ({
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
  clubsToInviteTo: ClubWithMemberIds[];
  loggedInUser: User | null;
  userToInvite: User;
}

export function InviteToClubMenu(props: InviteToClubMenuProps) {
  const classes = useStyles();
  const { clubsToInviteTo, loggedInUser, userToInvite } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [loginModalShown, setLoginModalShown] = React.useState(false);
  const [snackbarProps, setSnackbarProps] = React.useState<CustomSnackbarProps>(
    {
      autoHideDuration: 6000,
      isOpen: false,
      handleClose: onSnackbarClose,
      variant: 'success',
    }
  );

  const inviteMenuOpen = Boolean(anchorEl);

  function onCloseLoginModal() {
    setLoginModalShown(false);
  }

  function handleInviteMenuClose() {
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

  async function handleInviteToClub(club: Services.GetClubById) {
    if (loggedInUser) {
      const res = await inviteToClub(
        loggedInUser,
        userToInvite.discordId,
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
      {((loggedInUser && clubsToInviteTo.length > 0) || !loggedInUser) && (
        <Button
          className={classes.button}
          color="primary"
          variant="contained"
          onClick={handleClick}
          disabled={false}
        >
          <Typography variant="button">Invite to Club</Typography>
        </Button>
      )}
      {loggedInUser && clubsToInviteTo.length === 0 && (
        <Tooltip
          title="No clubs to invite to!"
          aria-label="No clubs to invite this person to."
        >
          <div>
            <Button
              className={classes.button}
              color="primary"
              variant="contained"
              onClick={handleClick}
              disabled={true}
            >
              <Typography variant="button">Invite to Club</Typography>
            </Button>
          </div>
        </Tooltip>
      )}
      <Menu
        open={inviteMenuOpen}
        anchorEl={anchorEl}
        onClose={handleInviteMenuClose}
        MenuListProps={{
          style: {
            paddingTop: 0,
            paddingBottom: 0,
          },
        }}
      >
        {clubsToInviteTo.map(clubWMIds => (
          <MenuItem
            key={clubWMIds.club._id}
            onClick={() => handleInviteToClub(clubWMIds.club)}
          >
            {clubWMIds.club.name}
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
