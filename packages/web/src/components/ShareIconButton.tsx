import {
  makeStyles,
  Menu,
  MenuItem,
  Button,
  Typography,
  Link,
} from '@material-ui/core';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ShareIcon from '@material-ui/icons/Share';
import { User } from '@caravan/buddy-reading-types';
import GenericGroupMemberIcon from './misc-avatars-icons-labels/icons/GenericGroupMemberIcon';
import { washedTheme } from '../theme';
import { logout } from '../services/user';
import DiscordLoginModal from './DiscordLoginModal';
import CustomSnackbar, { CustomSnackbarProps } from './CustomSnackbar';
import getReferralLink from '../functions/getReferralLink';

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
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  button: {
    textTransform: 'none',
    marginRight: theme.spacing(2),
    paddingHorizontal: theme.spacing(1),
    backgroundColor: washedTheme.palette.primary.main,
  },
}));

interface ShareIconButtonProps extends RouteComponentProps<{}> {
  user: User | null;
}

function ShareIconButton(props: ShareIconButtonProps) {
  const classes = useStyles();

  const shareMenuAnchorRef = React.useRef<HTMLDivElement>(null);

  const { user } = props;

  const [snackbarProps, setSnackbarProps] = React.useState<CustomSnackbarProps>(
    {
      autoHideDuration: 6000,
      isOpen: false,
      handleClose: onSnackbarClose,
      variant: 'success',
    }
  );

  const [shareMenuIsOpen, setShareMenuIsOpen] = React.useState(false);

  function handleShareMenuClose(event: React.MouseEvent<EventTarget>) {
    if (
      shareMenuAnchorRef.current &&
      shareMenuAnchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setShareMenuIsOpen(false);
  }

  function onSnackbarClose() {
    setSnackbarProps({ ...snackbarProps, isOpen: false });
  }

  function copyToClipboard(refLink: string) {
    const el = document.createElement('textarea');
    el.value = refLink;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setSnackbarProps({
      ...snackbarProps,
      isOpen: true,
      variant: 'info',
      message: 'Copied referral link to clipboard!',
    });
    setShareMenuIsOpen(false);
  }

  return (
    <>
      <div
        onClick={() => setShareMenuIsOpen(true)}
        className={classes.buttonContainer}
        ref={shareMenuAnchorRef}
      >
        <IconButton color="primary" className={classes.button} disabled={false}>
          <ShareIcon />
        </IconButton>
      </div>
      <Menu
        open={shareMenuIsOpen}
        anchorEl={shareMenuAnchorRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={handleShareMenuClose}
      >
        <Link
          href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcaravanapp.ca%2F&amp;src=sdkpreparse"
          target={'_blank'}
        >
          <MenuItem>Facebook</MenuItem>
        </Link>
        <Link
          href="https://twitter.com/intent/tweet/?text=Looking%20to%20read%20more%3F%20Want%20to%20find%20people%20to%20talk%20about%20your%20favourite%20books%20with%3F%20Check%20out%20Caravan&amp;url=https%3A%2F%2Fcaravanapp.ca%2clubs"
          target={'_blank'}
        >
          <MenuItem>Twitter</MenuItem>
        </Link>
        <MenuItem
          onClick={() =>
            copyToClipboard(
              getReferralLink(user ? user._id : undefined, 'profile')
            )
          }
        >
          Copy Link
        </MenuItem>
      </Menu>
      <CustomSnackbar {...snackbarProps} />
    </>
  );
}

export default withRouter(ShareIconButton);
