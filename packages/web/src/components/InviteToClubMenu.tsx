import React from 'react';
import { makeStyles, Menu, MenuItem } from '@material-ui/core';
import { User, Services } from '@caravan/buddy-reading-types';
import { washedTheme } from '../theme';

const useStyles = makeStyles(() => ({
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
}));

interface InviteToClubMenuProps {
  user: User | null;
  clubsToInviteTo: Services.GetClubs['clubs'];
  inviteClubsMenuShown: boolean;
}

export function InviteToClubMenu(props: InviteToClubMenuProps) {
  const headerProfileAnchorRef = React.useRef<HTMLDivElement>(null);
  const { user, inviteClubsMenuShown, clubsToInviteTo } = props;
  const [, setHeaderProfileMenuOpenState] = React.useState(false);

  function handleProfileMenuClose(event: React.MouseEvent<EventTarget>) {
    if (
      headerProfileAnchorRef.current &&
      headerProfileAnchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setHeaderProfileMenuOpenState(false);
  }

  return (
    <Menu
      open={inviteClubsMenuShown}
      anchorEl={headerProfileAnchorRef.current}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      onClose={handleProfileMenuClose}
    >
      {clubsToInviteTo.map(club => (
        <MenuItem>{club.name}</MenuItem>
      ))}
    </Menu>
  );
}
