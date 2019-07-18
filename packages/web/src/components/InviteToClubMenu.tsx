import { makeStyles, Menu, MenuItem } from '@material-ui/core';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { User, Services } from '@caravan/buddy-reading-types';
import GenericGroupMemberIcon from './misc-avatars-icons-labels/icons/GenericGroupMemberIcon';
import { washedTheme } from '../theme';
import { logout } from '../services/user';
import DiscordLoginModal from './DiscordLoginModal';

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
}));

interface InviteToClubMenuProps {
  user: User | null;
  clubsToInviteTo: Services.GetClubs['clubs'];
  inviteClubsMenuShown: boolean;
}

export function InviteToClubMenu(props: InviteToClubMenuProps) {
  const classes = useStyles();

  const headerProfileAnchorRef = React.useRef<HTMLDivElement>(null);

  const { user, inviteClubsMenuShown, clubsToInviteTo } = props;

  const [loginModalShown, setLoginModalShown] = React.useState(false);

  const [
    headerProfileMenuIsOpen,
    setHeaderProfileMenuOpenState,
  ] = React.useState(false);

  function onCloseLoginModal() {
    setLoginModalShown(false);
  }

  function handleProfileClick() {
    setHeaderProfileMenuOpenState(isOpen => !isOpen);
  }

  function handleProfileMenuClose(event: React.MouseEvent<EventTarget>) {
    if (
      headerProfileAnchorRef.current &&
      headerProfileAnchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setHeaderProfileMenuOpenState(false);
  }
  if (user) {
    console.log('User');
    console.log(user.urlSlug);
  }
  console.log('clubs to invite');
  console.log(clubsToInviteTo);

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
