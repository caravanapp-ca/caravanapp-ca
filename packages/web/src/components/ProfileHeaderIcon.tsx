import React from 'react';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';

import { User } from '@caravanapp/types';
import {
  Avatar,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Tooltip,
} from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';

import { DISCORD_GUILD_LINK } from '../common/globalConstants';
import { logout } from '../services/user';
import { washedTheme } from '../theme';
import DiscordLoginModal from './DiscordLoginModal';
import GenericGroupMemberIcon from './misc-avatars-icons-labels/icons/GenericGroupMemberIcon';

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

interface HeaderRightProps extends RouteComponentProps<{}> {
  user: User | null;
}

function ProfileHeaderIcon(props: HeaderRightProps) {
  const classes = useStyles();
  const history = useHistory();
  const headerProfileAnchorRef = React.useRef<HTMLDivElement>(null);
  const { user } = props;

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

  function navigateToYourProfile() {
    if (user) {
      history.push(`/user/${user.urlSlug}`);
    }
  }

  function navigateToSettings() {
    if (user) {
      history.push(`/settings`);
    }
  }

  function openChat() {
    window.open(DISCORD_GUILD_LINK, '_blank');
  }

  function handleLogout() {
    history.replace({ state: {} });
    logout();
  }

  return (
    <>
      {user ? (
        <div
          onClick={handleProfileClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          ref={headerProfileAnchorRef}
        >
          <Avatar
            alt={user.name || user.discordUsername}
            src={user.photoUrl}
            className={classes.headerAvatar}
          />
          <ArrowDropDown className={classes.headerArrowDown} />
        </div>
      ) : (
        <Tooltip title="View profile" aria-label="View profile">
          <IconButton
            onClick={() => setLoginModalShown(true)}
            className={classes.profileIconCircle}
          >
            <GenericGroupMemberIcon color="primary" />
          </IconButton>
        </Tooltip>
      )}
      <Menu
        open={headerProfileMenuIsOpen}
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
        <MenuItem onClick={navigateToYourProfile}>Your profile</MenuItem>
        <MenuItem onClick={navigateToSettings}>Settings</MenuItem>
        <MenuItem onClick={openChat}>Open chat</MenuItem>
        <MenuItem onClick={handleLogout}>Log out</MenuItem>
      </Menu>
      <DiscordLoginModal
        onCloseLoginDialog={onCloseLoginModal}
        open={loginModalShown}
      />
    </>
  );
}

export default withRouter(ProfileHeaderIcon);
