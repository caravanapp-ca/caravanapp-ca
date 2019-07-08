import { makeStyles, Theme, createStyles } from '@material-ui/core';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { User } from '@caravan/buddy-reading-types';
import AdapterLink from './AdapterLink';
import GenericGroupMemberIcon from './misc-avatars-icons-labels/icons/GenericGroupMemberIcon';
import { washedTheme } from '../theme';

const useStyles = makeStyles(theme => ({
  headerAvatar: {
    marginLeft: 12,
    width: 48,
    height: 48,
  },
  headerArrowDown: {
    height: 20,
    width: 20,
  },
  createClubIconCircle: {
    backgroundColor: washedTheme.palette.primary.main,
  },
  profileIconCircle: {
    backgroundColor: washedTheme.palette.primary.main,
    margin: 16,
  },
}));

interface HeaderRightProps {
  user: User | null;
  onClickWhileLoggedOut: () => void;
  handleProfileClick: () => void;
}

export default function HeaderRightCreateClubProfile(props: HeaderRightProps) {
  const classes = useStyles();

  const headerProfileAnchorRef = React.useRef<HTMLDivElement>(null);

  const { user } = props;

  return (
    <>
      <Tooltip title="Create club" aria-label="Create club">
        {user ? (
          <IconButton
            edge="start"
            color="primary"
            aria-label="Add"
            component={AdapterLink}
            to="/clubs/create"
            className={classes.createClubIconCircle}
          >
            <AddIcon />
          </IconButton>
        ) : (
          <IconButton
            edge="start"
            color="primary"
            aria-label="Add"
            onClick={() => props.onClickWhileLoggedOut()}
            className={classes.createClubIconCircle}
          >
            <AddIcon />
          </IconButton>
        )}
      </Tooltip>
      {user ? (
        <div
          onClick={() => props.handleProfileClick()}
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
            onClick={() => props.onClickWhileLoggedOut()}
            className={classes.profileIconCircle}
          >
            <GenericGroupMemberIcon color="primary" />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
}
