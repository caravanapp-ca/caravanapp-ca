import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { makeStyles, Menu, MenuItem } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { User } from '@caravan/buddy-reading-types';
import GenericGroupMemberIcon from './misc-avatars-icons-labels/icons/GenericGroupMemberIcon';
import { washedTheme } from '../theme';
import { logout } from '../services/user';
import DiscordLoginModal from './DiscordLoginModal';
import { DISCORD_GUILD_LINK } from '../common/globalConstants';

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
      props.history.push(`/user/${user.urlSlug}`);
    }
  }

  function navigateToSettings() {
    if (user) {
      props.history.push(`/settings`);
    }
  }

  function openChat() {
    window.open(DISCORD_GUILD_LINK, '_blank');
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
        <MenuItem onClick={logout}>Log out</MenuItem>
      </Menu>
      <DiscordLoginModal
        onCloseLoginDialog={onCloseLoginModal}
        open={loginModalShown}
      />
    </>
  );
}

export default withRouter(ProfileHeaderIcon);
