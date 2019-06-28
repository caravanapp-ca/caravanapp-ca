import React from 'react';
import { AppBar, Toolbar, useScrollTrigger, Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

interface ScrollProps {
  children: React.ReactElement;
}

interface HeaderProps {
  leftComponent?: JSX.Element;
  rightComponent?: JSX.Element;
  centerComponent?: JSX.Element;
  children?: React.ReactElement;
  showBorder?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: 'white',
      color: 'inherit',
    },
    bottomBorder: {
      display: 'block',
      height: 2,
      width: '100%',
      backgroundColor: theme.palette.primary.main,
    },
    toolBarLeftContainer: {
      display: 'flex',
      flexGrow: 1,
      justifyContent: 'flex-start',
    },
    toolBarCenterContainer: {
      display: 'flex',
      flexGrow: 1,
      justifyContent: 'center',
    },
    toolBarRightContainer: {
      display: 'flex',
      flexGrow: 1,
      justifyContent: 'flex-end',
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
  const { leftComponent, centerComponent, rightComponent, showBorder } = props;

  return (
    <ElevationScroll {...props}>
      <AppBar className={classes.appBar} position="sticky">
        <Toolbar>
          <Grid
            container
            spacing={0}
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid item xs={2}>
              <div className={classes.toolBarLeftContainer}>
                {leftComponent}
              </div>
            </Grid>
            <Grid item xs={8}>
              <div className={classes.toolBarCenterContainer}>
                {centerComponent}
              </div>
            </Grid>
            <Grid item xs={2}>
              <div className={classes.toolBarRightContainer}>
                {rightComponent}
              </div>
            </Grid>
          </Grid>
        </Toolbar>
        {showBorder === false && <div className={classes.bottomBorder} />}
      </AppBar>
    </ElevationScroll>
  );
}
