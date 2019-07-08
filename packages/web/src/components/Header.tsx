import React from 'react';
import {
  AppBar,
  Toolbar,
  useScrollTrigger,
  Grid,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
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
    toolBarContainer: {
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    toolBarLeftContainerMobile: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginRight: 16,
    },
    toolBarCenterContainerMobile: {
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-Start',
    },
    toolBarRightContainerMobile: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginLeft: 16,
    },
    toolBarLeftContainerDesktop: {
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-Start',
    },
    toolBarCenterContainerDesktop: {
      display: 'flex',
      flex: 4,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    toolBarRightContainerDesktop: {
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
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
  const theme = useTheme();
  const { leftComponent, centerComponent, rightComponent, showBorder } = props;
  const screenSmallerThanSm = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <ElevationScroll {...props}>
      <AppBar className={classes.appBar} position="sticky">
        <Toolbar>
          <div className={classes.toolBarContainer}>
            <div
              className={
                screenSmallerThanSm
                  ? classes.toolBarLeftContainerMobile
                  : classes.toolBarLeftContainerDesktop
              }
            >
              {leftComponent}
            </div>
            <div
              className={
                screenSmallerThanSm
                  ? classes.toolBarCenterContainerMobile
                  : classes.toolBarCenterContainerDesktop
              }
            >
              {centerComponent}
            </div>
            <div
              className={
                screenSmallerThanSm
                  ? classes.toolBarRightContainerMobile
                  : classes.toolBarRightContainerDesktop
              }
            >
              {rightComponent}
            </div>
          </div>
        </Toolbar>
        {showBorder !== false && <div className={classes.bottomBorder} />}
      </AppBar>
    </ElevationScroll>
  );
}
