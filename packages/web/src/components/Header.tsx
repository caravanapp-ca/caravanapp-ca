import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

interface HeaderProps {
  leftComponent?: JSX.Element;
  rightComponent?: JSX.Element;
  centerComponent?: JSX.Element;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      textAlign: 'center',
      backgroundColor: 'white',
    },
  })
);

export default function ButtonAppBar(props: HeaderProps) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar
        style={{
          backgroundColor: 'white',
          color: 'black',
          borderColor: '#7289da',
          borderBottom: 10,
        }}
        position="static"
      >
        <Toolbar>
          {props.leftComponent ? (
            props.leftComponent
          ) : null}
          {props.centerComponent ? (
            props.centerComponent
          ) : null}
          {props.rightComponent ? (
            props.rightComponent
          ) : null}
        </Toolbar>
      </AppBar>
    </div>
  );
}
