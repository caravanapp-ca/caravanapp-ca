import copyToClipboard from 'copy-to-clipboard';
import React from 'react';

import { User } from '@caravanapp/types';
import { IconButton, Link, makeStyles, Tooltip } from '@material-ui/core';

import { getReferralLink } from '../common/referral';
import copySvg from '../resources/share-icons/copy--whiteonblack.svg';
import emailSvg from '../resources/share-icons/email--whiteonblack.svg';
import fbSvg from '../resources/share-icons/fb--whiteonblack.svg';
import rdSvg from '../resources/share-icons/reddit--whiteonblack.svg';
import twitterSvg from '../resources/share-icons/twitter--whiteonblack.svg';

const useStyles = makeStyles(theme => ({
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  shareButton: {
    backgroundColor: 'white',
  },
  iconButton: {
    padding: theme.spacing(1),
  },
  shareIcon: {
    height: 40,
    width: 40,
  },
}));

interface ClubShareButtonsProps {
  user: User | null;
  clubId: string;
  bookTitle: string;
  bookAuthor: string;
  onCopyReferralLink: () => void;
}

export default function ClubShareButtons(props: ClubShareButtonsProps) {
  const classes = useStyles();

  const { user, clubId, bookTitle, bookAuthor, onCopyReferralLink } = props;

  function callCopyToClipboardMethod() {
    copyToClipboard(
      getReferralLink(
        user ? user._id : undefined,
        'club',
        clubId ? clubId : undefined
      )
    );
    onCopyReferralLink();
  }

  const authorURIString = bookAuthor
    ? encodeURIComponent(`by ${bookAuthor}.`)
    : '';

  return (
    <div className={classes.buttonContainer}>
      <Tooltip title="Share club on Reddit" aria-label="Share club on Reddit">
        <Link
          href={
            user
              ? `http://www.reddit.com/submit?url=https%3A%2F%2Fcaravanapp.ca%2Fclubs%2F${clubId}%3Fref%3D${
                  user._id
                }%26utm_source%3Drd&title=Check%20out%20this%20online%20book%20club%20on%20Caravan%20currently%20reading%20${encodeURIComponent(
                  `"${bookTitle}"`
                )}`
              : `http://www.reddit.com/submit?url=https%3A%2F%2Fcaravanapp.ca%2Fclubs%2F${clubId}%3Futm_source%3Drd&title=Check%20out%20this%20online%20book%20club%20on%20Caravan%20currently%20reading%20${encodeURIComponent(
                  `"${bookTitle}"`
                )}`
          }
          target={'_blank'}
        >
          <IconButton color="primary" classes={{ root: classes.iconButton }}>
            <img
              src={rdSvg}
              alt="Share club on Reddit"
              className={classes.shareIcon}
            />
          </IconButton>
        </Link>
      </Tooltip>
      <Tooltip
        title="Share club on Facebook"
        aria-label="Share club on Facebook"
      >
        <Link
          href={
            user
              ? `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcaravanapp.ca%2Fclubs%2F${clubId}%3Fref%3D${user._id}%26utm_source%3Dfb%2F&amp;src=sdkpreparse`
              : `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcaravanapp.ca%2Fclubs%2F${clubId}%3Futm_source%3Dfb%2F&amp;src=sdkpreparse`
          }
          target={'_blank'}
        >
          <IconButton color="primary" classes={{ root: classes.iconButton }}>
            <img
              src={fbSvg}
              alt="Share club on Facebook"
              className={classes.shareIcon}
            />
          </IconButton>
        </Link>
      </Tooltip>
      <Tooltip title="Share club on Twitter" aria-label="Share club on Twitter">
        <Link
          href={
            user
              ? `https://twitter.com/intent/tweet/?original_referer=https%3A%2F%2Fcaravanapp.ca%2Fclubs%2F${clubId}%3Fref%3D${
                  user._id
                }%26utm_source%3Dtw&text=Check%20out%20this%20online%20book%20club%20on%20Caravan,%20currently%20reading%20${encodeURIComponent(
                  `"${bookTitle}"`
                )}%20${authorURIString}&url=https%3A%2F%2Fcaravanapp.ca%2Fclubs%2F${clubId}%3Fref%3D${
                  user._id
                }%26utm_source%3Dtw`
              : `https://twitter.com/intent/tweet/?original_referer=https%3A%2F%2Fcaravanapp.ca%2Fclubs%2F${clubId}%3Futm_source%3Dtw&text=Check%20out%20this%20online%20book%20club%20on%20Caravan,%20currently%20reading%20${encodeURIComponent(
                  `"${bookTitle}"`
                )}%20${authorURIString}&url=https%3A%2F%2Fcaravanapp.ca%2Fclubs%2F${clubId}%3Futm_source%3Dtw`
          }
          target={'_blank'}
        >
          <IconButton color="primary" classes={{ root: classes.iconButton }}>
            <img
              src={twitterSvg}
              alt="Share club on Twitter"
              className={classes.shareIcon}
            />
          </IconButton>
        </Link>
      </Tooltip>
      <Tooltip title="Share club via email" aria-label="Share club via email">
        <Link
          href={
            user
              ? `mailto:?subject=Read%20${encodeURIComponent(
                  `"${bookTitle}"`
                )}%20with%20me%20on%20this%20cool%20new%20site%20for%20online%20book%20clubs!&body=Check%20out%20this%20online%20book%20club%20on%20Caravan,%20currently%20reading%20${encodeURIComponent(
                  `"${bookTitle}"`
                )}%20${authorURIString}%0D%0Ahttps%3A%2F%2Fcaravanapp.ca%2Fclubs%2F${clubId}%3Fref%3D${
                  user._id
                }%26utm_source%3Dem`
              : `mailto:?subject=Read%20${encodeURIComponent(
                  `"${bookTitle}"`
                )}%20with%20me%20on%20this%20cool%20new%20site%20for%20online%20book%20clubs!&body=Check%20out%20this%20online%20book%20club%20on%20Caravan,%20currently%20reading%20${encodeURIComponent(
                  `"${bookTitle}"`
                )}%20${authorURIString}%0D%0Ahttps%3A%2F%2Fcaravanapp.ca%2Fclubs%2F${clubId}%3Futm_source%3Dem`
          }
          target={'_blank'}
        >
          <IconButton color="primary" classes={{ root: classes.iconButton }}>
            <img
              src={emailSvg}
              alt="Share club via email"
              className={classes.shareIcon}
            />
          </IconButton>
        </Link>
      </Tooltip>
      <Tooltip
        title="Copy link to clipboard"
        aria-label="Copy link to clipboard"
      >
        <Link>
          <IconButton
            color="primary"
            className={classes.iconButton}
            onClick={callCopyToClipboardMethod}
          >
            <img
              src={copySvg}
              alt="Copy to clipboard"
              className={classes.shareIcon}
            />
          </IconButton>
        </Link>
      </Tooltip>
    </div>
  );
}
