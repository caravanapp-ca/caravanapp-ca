import React from 'react';
import { UserSearchField } from '@caravan/buddy-reading-types';
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Fab,
  Typography,
} from '@material-ui/core';
import NavigationIcon from '@material-ui/icons/Navigation';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  postTypes: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  fab: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

interface ComposerProps {
  onClickShelfUpload: () => void;
  onClickProgressUpdateUpload: () => void;
  onClickWantToReadAboutUpload: () => void;
}

export default function Composer(props: ComposerProps) {
  const classes = useStyles();

  const {
    onClickShelfUpload,
    onClickProgressUpdateUpload,
    onClickWantToReadAboutUpload,
  } = props;

  return (
    <>
      <Typography>Create a post</Typography>
      <div className={classes.postTypes}>
        <Fab
          variant="extended"
          aria-label="delete"
          className={classes.fab}
          onClick={onClickShelfUpload}
        >
          <NavigationIcon className={classes.extendedIcon} />
          Shelf
        </Fab>
      </div>
    </>
  );
}
