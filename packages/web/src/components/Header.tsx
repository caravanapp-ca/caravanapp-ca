import React from 'react';
import { AppBar, Toolbar, useScrollTrigger } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

interface ScrollProps {
  children: React.ReactElement;
}

interface HeaderProps {
  leftComponent?: JSX.Element;
  rightComponent?: JSX.Element;
  centerComponent?: JSX.Element;
  children?: React.ReactElement;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: 'white',
      color: 'inherit',
    },
    toolBar: {
      justifyContent: 'space-between',
    },
    bottomBorder: {
      display: 'block',
      height: 2,
      width: '100%',
      backgroundColor: '#7289da',
    },
  })
);

function ElevationScroll(props: ScrollProps) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export default function ButtonAppBar(props: HeaderProps) {
  const classes = useStyles();
  const { leftComponent, centerComponent, rightComponent } = props;

  return (
    <ElevationScroll {...props}>
      <AppBar className={classes.appBar} position="sticky">
        <Toolbar className={classes.toolBar}>
          {leftComponent}
          {centerComponent}
          {rightComponent}
        </Toolbar>
        <div className={classes.bottomBorder} />
      </AppBar>
    </ElevationScroll>
  );
}
