import React from 'react';
import { PostUserInfo } from '@caravan/buddy-reading-types';
import { Fab, Typography, Avatar } from '@material-ui/core';
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import shelfIcon from '../resources/post-icons/shelf_icon.svg';
import { shelfPostTheme } from '../theme';

const useStyles = makeStyles(theme => ({
  postTypes: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 48,
    height: 48,
  },
  fab: {
    margin: theme.spacing(1),
  },
  postIconAvatar: {
    width: 48,
    height: 48,
    padding: theme.spacing(1),
  },
}));

interface ComposerProps {
  currUserInfo: PostUserInfo | null;
  onClickShelfUpload: () => void;
  onClickProgressUpdateUpload: () => void;
  onClickWantToReadAboutUpload: () => void;
}

export default function Composer(props: ComposerProps) {
  const classes = useStyles();

  const {
    currUserInfo,
    onClickShelfUpload,
    onClickProgressUpdateUpload,
    onClickWantToReadAboutUpload,
  } = props;

  return (
    <div className={classes.postTypes}>
      {currUserInfo && (
        <Avatar
          alt={currUserInfo.name}
          src={currUserInfo.photoUrl}
          className={classes.headerAvatar}
        />
      )}
      <MuiThemeProvider theme={shelfPostTheme}>
        <Fab
          variant="extended"
          aria-label="upload-shelf"
          className={classes.fab}
          onClick={onClickShelfUpload}
          color="primary"
        >
          <Typography
            variant="button"
            style={{ fontWeight: 600, color: 'white' }}
          >
            Upload Shelf
          </Typography>
          <img
            src={shelfIcon}
            alt="Upload shelf"
            className={classes.postIconAvatar}
          />
        </Fab>
      </MuiThemeProvider>
    </div>
  );
}
