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
import { getReferralLink } from '../functions/referral';

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
  copyToClipboard: (refLink: string) => void;
}

function ShareIconButton(props: ShareIconButtonProps) {
  const classes = useStyles();

  const shareMenuAnchorRef = React.useRef<HTMLDivElement>(null);

  const { user, copyToClipboard } = props;

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

  function callCopyToClipboardMethod() {
    copyToClipboard(getReferralLink(user ? user._id : undefined, 'profile'));
    setShareMenuIsOpen(false);
  }

  return (
    <>
      <Tooltip title="Share Caravan" aria-label="Share Caravan">
        <div
          onClick={() => setShareMenuIsOpen(true)}
          className={classes.buttonContainer}
          ref={shareMenuAnchorRef}
        >
          <IconButton
            color="primary"
            className={classes.button}
            disabled={false}
          >
            <ShareIcon />
          </IconButton>
        </div>
      </Tooltip>
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
          onClick={() => setShareMenuIsOpen(false)}
        >
          <MenuItem>Facebook</MenuItem>
        </Link>
        <Link
          href="https://twitter.com/intent/tweet/?text=Looking%20to%20read%20more%3F%20Want%20to%20find%20people%20to%20talk%20about%20your%20favourite%20books%20with%3F%20Check%20out%20Caravan&amp;url=https%3A%2F%2Fcaravanapp.ca%2Fclubs"
          target={'_blank'}
          onClick={() => setShareMenuIsOpen(false)}
        >
          <MenuItem>Twitter</MenuItem>
        </Link>
        <Link
          href="mailto:?subject=Come%20join%20me%20on%20this%20cool%20new%20buddy%20reading%20site%20Caravan:%20https%3A%2F%2Fcaravanapp.ca%2Fclubs&body=%20Check%20out%20this%20cool%20new%20site%20for%20online%20book%20clubs%21%0D%0Ahttps%3A%2F%2Fcaravanapp.ca%2Fclubs"
          target={'_blank'}
          onClick={() => setShareMenuIsOpen(false)}
        >
          <MenuItem>Email</MenuItem>
        </Link>
        <Link>
          <MenuItem onClick={callCopyToClipboardMethod}>Copy Link</MenuItem>
        </Link>
      </Menu>
    </>
  );
}

export default withRouter(ShareIconButton);
