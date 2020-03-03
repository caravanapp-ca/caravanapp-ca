import React from 'react';
import { format } from 'date-fns';
import {
  makeStyles,
  Link,
  Typography,
  Menu,
  MenuItem,
  IconButton,
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import OptionsIcon from '@material-ui/icons/MoreVert';
import { PostUserInfo } from '@caravanapp/buddy-reading-types';
import AdapterLink from '../../components/AdapterLink';

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
    width: 48,
    height: 48,
  },
  userTextContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
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
    width: 42,
    height: 42,
    padding: theme.spacing(1),
  },
}));

interface PostHeaderProps {
  postAuthorInfo: PostUserInfo;
  postIcon: string;
  iconColor: string;
  postDate: string | Date;
  ownPost: boolean;
  onClickDelete: () => void;
  postId: string;
}

function PostHeader(props: PostHeaderProps) {
  const classes = useStyles();
  const {
    postAuthorInfo,
    postIcon,
    iconColor,
    postDate,
    ownPost,
    onClickDelete,
    postId,
  } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const editMenuOpen = Boolean(anchorEl);

  function openEditMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

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
          color="primary"
        >
          <Typography variant="h6" className={classes.userNameText}>
            {postAuthorInfo.name}
          </Typography>
        </Link>
        <Typography variant="caption" color="textSecondary">
          {`${format(new Date(postDate), 'PP')}`}
        </Typography>
      </div>
      <div className={classes.iconContainer}>
        {!ownPost && (
          <Avatar
            alt={'shelf post'}
            src={postIcon}
            className={classes.postIconAvatar}
            style={{ backgroundColor: iconColor }}
          />
        )}
        {ownPost && (
          <IconButton
            onClick={openEditMenu}
            color="inherit"
            className={classes.postIconAvatar}
          >
            <OptionsIcon />
          </IconButton>
        )}
      </div>
      <Menu
        open={editMenuOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          style: {
            paddingTop: 0,
            paddingBottom: 0,
          },
        }}
      >
        <MenuItem component={AdapterLink} to={`/posts/${postId}/edit`}>
          Edit Shelf
        </MenuItem>
        <MenuItem onClick={onClickDelete}>Delete Shelf</MenuItem>
      </Menu>
    </div>
  );
}

export default PostHeader;
