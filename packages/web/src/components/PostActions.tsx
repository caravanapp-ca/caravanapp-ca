import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { makeStyles, Button, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';

const useStyles = makeStyles(theme => ({
  actionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  likesContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  likeButton: {
    height: 30,
    width: 30,
  },
  createClubButtonContainer: {
    padding: theme.spacing(1),
  },
  createClubButton: {
    textTransform: 'none',
  },
}));

interface PostActionsProps extends RouteComponentProps<{}> {
  postId: string;
}

function PostActions(props: PostActionsProps) {
  const classes = useStyles();

  return (
    <div className={classes.actionContainer}>
      <div className={classes.likesContainer}>
        <IconButton onClick={() => console.log('Like')}>
          <FavoriteIcon
            className={classes.likeButton}
            style={{ fill: '#AF0020' }}
          />
        </IconButton>
      </div>
      <div className={classes.createClubButtonContainer}>
        <Button
          className={classes.createClubButton}
          variant="contained"
          color="primary"
        >
          <Typography variant="subtitle1">Create club from shelf</Typography>
        </Button>
      </div>
    </div>
  );
}

export default withRouter(PostActions);
