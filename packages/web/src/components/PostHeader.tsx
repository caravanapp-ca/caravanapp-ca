import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { makeStyles, Link } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { PostUserInfo } from '@caravan/buddy-reading-types';

const useStyles = makeStyles(theme => ({
  heading: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  userHeading: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  headerAvatar: {
    width: 60,
    height: 60,
  },
  userTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing(2),
  },
  userNameText: {
    fontWeight: 600,
  },
  postIconAvatar: {
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(2),
    width: 48,
    height: 48,
    padding: theme.spacing(1),
  },
}));

interface PostHeaderProps {
  postAuthorInfo: PostUserInfo;
  postIcon: string;
  iconColor: string;
}

function PostHeader(props: PostHeaderProps) {
  const classes = useStyles();
  const { postAuthorInfo, postIcon, iconColor } = props;

  return (
    <div className={classes.heading}>
      <div className={classes.userHeading}>
        <Link href={`/user/${postAuthorInfo.urlSlug}`}>
          <Avatar
            alt={postAuthorInfo.name}
            src={postAuthorInfo.photoUrl}
            className={classes.headerAvatar}
          />
        </Link>
        <div className={classes.userTextContainer}>
          <Link
            href={`/user/${postAuthorInfo.urlSlug}`}
            variant="h5"
            className={classes.userNameText}
            color="primary"
          >
            {postAuthorInfo.name}
          </Link>
        </div>
      </div>
      <Avatar
        alt={'shelf post'}
        src={postIcon}
        className={classes.postIconAvatar}
        style={{ backgroundColor: iconColor }}
      />
    </div>
  );
}

export default PostHeader;
