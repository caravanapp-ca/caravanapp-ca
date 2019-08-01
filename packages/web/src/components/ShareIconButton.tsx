import { makeStyles, Menu, MenuItem, Link } from '@material-ui/core';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ShareIcon from '@material-ui/icons/Share';
import copyToClipboard from 'copy-to-clipboard';
import { User } from '@caravan/buddy-reading-types';
import { washedTheme } from '../theme';
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

interface ShareIconButtonProps {
  user: User | null;
  onCopyReferralLink: () => void;
}

export default function ShareIconButton(props: ShareIconButtonProps) {
  const classes = useStyles();
  const shareMenuAnchorRef = React.useRef<HTMLDivElement>(null);
  const { user, onCopyReferralLink } = props;
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
    copyToClipboard(getReferralLink(user ? user._id : undefined, 'home'));
    onCopyReferralLink();
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
          href={
            user
              ? `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcaravanapp.ca%2Fclubs%3Fref%3D${
                  user._id
                }%26utm_source%3Dfb%2F&amp;src=sdkpreparse`
              : 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcaravanapp.ca%2Fclubs%3Futm_source%3Dfb%2F&amp;src=sdkpreparse'
          }
          target={'_blank'}
          onClick={() => setShareMenuIsOpen(false)}
        >
          <MenuItem>Facebook</MenuItem>
        </Link>
        <Link
          href={
            user
              ? `https://twitter.com/intent/tweet/?original_referer=https%3A%2F%2Fcaravanapp.ca%2Fclubs%3Fref%3D${
                  user._id
                }%26utm_source%3Dtw&text=Looking%20to%20read%20more%3F%20Want%20to%20find%20people%20to%20talk%20about%20your%20favourite%20books%20with%3F%20Check%20out%20Caravan&url=https%3A%2F%2Fcaravanapp.ca%2Fclubs%3Fref%3D${
                  user._id
                }%26utm_source%3Dtw`
              : `https://twitter.com/intent/tweet/?original_referer=https%3A%2F%2Fcaravanapp.ca%2Fclubs%3Futm_source%3Dtw&text=Looking%20to%20read%20more%3F%20Want%20to%20find%20people%20to%20talk%20about%20your%20favourite%20books%20with%3F%20Check%20out%20Caravan&url=https%3A%2F%2Fcaravanapp.ca%2Fclubs%3Futm_source%3Dtw`
          }
          target={'_blank'}
          onClick={() => setShareMenuIsOpen(false)}
        >
          <MenuItem>Twitter</MenuItem>
        </Link>
        <Link
          href={
            user
              ? `mailto:?subject=Come%20read%20with%20me%20on%20this%20cool%20new%20site%20for%20online%20book%20clubs&body=Looking%20to%20read%20more%3F%20Want%20to%20find%20people%20to%20talk%20about%20your%20favourite%20books%20with,%20from%20all%20around%20the%20world%3F%20Check%20out%20Caravan%20%0D%0Ahttps%3A%2F%2Fcaravanapp.ca%2Fclubs%3Fref%3D${
                  user._id
                }%26utm_source%3Dem`
              : 'mailto:?subject=Come%20read%20with%20me%20on%20this%20cool%20new%20site%20for%20online%20book%20clubs&body=Looking%20to%20read%20more%3F%20Want%20to%20find%20people%20to%20talk%20about%20your%20favourite%20books%20with,%20from%20all%20around%20the%20world%3F%20Check%20out%20Caravan%20%0D%0Ahttps%3A%2F%2Fcaravanapp.ca%2Fclubs%3Futm_source%3Dem'
          }
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
