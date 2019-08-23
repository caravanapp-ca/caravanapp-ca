import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { makeStyles, Link } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { PostUserInfo } from '@caravan/buddy-reading-types';

const useStyles = makeStyles(theme => ({
  heading: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, 0.07)', //use rgba to bump up opacity
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  userAvatarContainer: {
    marginLeft: theme.spacing(2),
  },
  headerAvatar: {
    width: 60,
    height: 60,
  },
  userTextContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: theme.spacing(2),
  },
  userNameText: {
    fontWeight: 600,
  },
  iconContainer: {
    marginRight: theme.spacing(2),
  },
  postIconAvatar: {
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
      <div className={classes.userAvatarContainer}>
        <Link href={`/user/${postAuthorInfo.urlSlug}`}>
          <Avatar
            alt={postAuthorInfo.name}
            src={postAuthorInfo.photoUrl}
            className={classes.headerAvatar}
          />
        </Link>
      </div>
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
      <div className={classes.iconContainer}>
        <Avatar
          alt={'shelf post'}
          src={postIcon}
          className={classes.postIconAvatar}
          style={{ backgroundColor: iconColor }}
        />
      </div>
    </div>
  );
}

export default PostHeader;
