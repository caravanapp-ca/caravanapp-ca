import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Theme,
  createStyles,
  Typography,
  Container,
  Button,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { darkTheme, whiteTheme } from '../../theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import splash from '../../resources/splash.svg';
import { User } from '@caravan/buddy-reading-types';
import ReactResizeDetector from 'react-resize-detector';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      position: 'relative',
      width: '100%',
      backgroundColor: theme.palette.primary.light,
      color: darkTheme.palette.text.primary,
    },
    rootContainer: {
      display: 'flex',
      flex: 1,
      marginTop: theme.spacing(8),
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      textAlign: 'center',
    },
    tagText: {
      fontWeight: 600,
    },
    p1: {
      marginTop: theme.spacing(4),
    },
    p2: {
      marginTop: theme.spacing(2),
    },
    splashImg: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      resizeMode: 'contain',
    },
    textContainer: {
      zIndex: 1,
    },
    buttonsContainer: {
      marginTop: theme.spacing(4),
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      zIndex: 1,
    },
    button: {
      margin: theme.spacing(1),
    },
    tagPeriod: {
      color: theme.palette.primary.dark,
    },
  })
);

interface SplashProps {
  user: User | null;
  onAboutClick: () => void;
  onLoginClick: () => void;
  onOpenChatClick: () => void;
  onDismissClick: () => void;
  onSeeClubsClick: () => void;
}

export default function Splash(props: SplashProps) {
  const {
    user,
    onAboutClick,
    onLoginClick,
    onOpenChatClick,
    onDismissClick,
    onSeeClubsClick,
  } = props;
  const classes = useStyles();
  const theme = useTheme();
  const screenSmallerThanSm = useMediaQuery(theme.breakpoints.down('xs'));
  const [winHeight, setWinHeight] = React.useState<number>(window.innerHeight);

  const headerHeight = screenSmallerThanSm ? 56 : 64;

  let logInButtonMsg = 'LOG IN WITH DISCORD';
  let aboutButtonMsg = 'ABOUT US';
  if (screenSmallerThanSm) {
    logInButtonMsg = 'LOG IN';
    aboutButtonMsg = 'ABOUT';
  }

  const handleWinResize = () => {
    setWinHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWinResize);
    return () => {
      window.removeEventListener('resize', handleWinResize);
    };
  }, []);

  return (
    <div
      className={classes.root}
      style={{
        height: winHeight - headerHeight,
      }}
    >
      <Container maxWidth="md" className={classes.rootContainer}>
        <MuiThemeProvider theme={darkTheme}>
          <div className={classes.textContainer}>
            <Typography
              color="textPrimary"
              variant="h3"
              className={classes.tagText}
            >
              {'Find your perfect reading buddies'}
              <span className={classes.tagPeriod}>{'.'}</span>
            </Typography>
            <Typography
              color="textSecondary"
              variant="h5"
              className={classes.p1}
            >
              Start by browsing and joining existing clubs, or by creating your
              own club!
            </Typography>
            <Typography
              color="textSecondary"
              variant="h5"
              className={classes.p2}
            >
              When you join or create a club you'll be automatically added to
              the club's Discord channel.
            </Typography>
          </div>
        </MuiThemeProvider>
        <div className={classes.buttonsContainer}>
          <MuiThemeProvider theme={whiteTheme}>
            {user && (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={onDismissClick}
              >
                <Typography color="secondary" variant="button">
                  DISMISS
                </Typography>
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={onSeeClubsClick}
            >
              <Typography color="secondary" variant="button">
                SEE CLUBS
              </Typography>
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={onAboutClick}
            >
              <Typography color="secondary" variant="button">
                {aboutButtonMsg}
              </Typography>
            </Button>
          </MuiThemeProvider>
          {!user && (
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={onLoginClick}
            >
              <Typography variant="button">{logInButtonMsg}</Typography>
            </Button>
          )}
          {user && (
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={onOpenChatClick}
            >
              <Typography variant="button">OPEN CHAT</Typography>
            </Button>
          )}
        </div>
      </Container>
      <img src={splash} alt="Splash" className={classes.splashImg} />
    </div>
  );
}
