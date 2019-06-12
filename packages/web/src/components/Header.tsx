import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      textAlign: 'center',
    },
    homeButton: {
      marginRight: theme.spacing(2),
    },
    addButton: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(0),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.homeButton} color="inherit" aria-label="Home">
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Find Buddies
          </Typography>
          <IconButton edge="start" className={classes.addButton} color="inherit" aria-label="Add">
            <AddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
