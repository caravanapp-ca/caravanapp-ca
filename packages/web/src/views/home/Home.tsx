import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import qs from 'query-string';
import { UserDoc } from '@caravan/buddy-reading-types';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';
import AdapterLink from '../../components/AdapterLink';
import Header from '../../components/Header';
import { deleteCookie } from '../../common/cookies';
import { DISCORD_OAUTH_STATE } from '../../state';
import ClubCards from './ClubCards';
import { UserCard } from './UserCard';

interface HomeProps {
  user: UserDoc | null;
}

const useStyles = makeStyles(theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
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
    fontWeight: 'bold',
  },
}));

export default function Home(props: HomeProps) {
  const classes = useStyles();
  // Handle the `state` query to verify login
  useEffect(() => {
    const queries = qs.parse(window.location.search);
    if (queries && queries.state) {
      // Someone tampered with the login, remove token
      if (queries.state !== localStorage.getItem(DISCORD_OAUTH_STATE)) {
        deleteCookie('token');
      }
      localStorage.removeItem(DISCORD_OAUTH_STATE);
    }
  }, []);

  const leftComponent = (
    <IconButton
      edge="start"
      className={classes.homeButton}
      color="inherit"
      aria-label="Home"
      component={AdapterLink}
      to="/"
    >
      <HomeIcon />
    </IconButton>
  );

  const centerComponent = (
    <Typography variant="h6" className={classes.title}>
      Find Groups
    </Typography>
  );

  const rightComponent = (
    <IconButton
      edge="start"
      className={classes.addButton}
      color="inherit"
      aria-label="Add"
      component={AdapterLink}
      to="/club/create"
    >
      <AddIcon />
    </IconButton>
  );

  return (
    <>
      <CssBaseline />
      <Header
        leftComponent={leftComponent}
        centerComponent={centerComponent}
        rightComponent={rightComponent}
      />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Album layout
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Something short and leading about the collection below—its
              contents, the creator, etc. Make it short and sweet, but not too
              short so folks don&apos;t simply skip over it entirely.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary">
                    Main call to action
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary">
                    Secondary action
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <ClubCards />
        <UserCard user={props.user} />
      </main>
    </>
  );
}
