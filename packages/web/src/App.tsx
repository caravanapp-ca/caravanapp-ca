import qs from 'query-string';
import React, { useEffect, useState } from 'react';
import ReactResizeDetector from 'react-resize-detector';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import type { ReferralDestination, User } from '@caravanapp/types';
import DateFnsUtils from '@date-io/date-fns';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import { getDiscordAuthUrl } from './common/auth';
import { getClubIdFromPathname } from './common/club';
import { deleteCookie, getCookie } from './common/cookies';
import { GAListener } from './common/GAListener';
import getUtmSourceValue from './common/getUtmSourceValue';
import {
  clearStorageAuthState,
  KEY_DISCORD_OAUTH_STATE,
  KEY_USER,
} from './common/localStorage';
import Footer from './components/Footer';
import CreateShelf from './components/post-uploads/CreateShelf';
import { validateDiscordPermissions } from './services/auth';
import { handleReferral } from './services/referral';
import { getUser } from './services/user';
import theme from './theme';
import About from './views/about/About';
import Club from './views/club/Club';
import CreateClub from './views/club/CreateClub';
import UpdateBook from './views/club/UpdateBook';
import Home from './views/home/Home';
import Onboarding from './views/onboarding/Onboarding';
import EditShelf from './views/post/EditShelf';
import Post from './views/post/Post';
import Privacy from './views/privacy/Privacy';
import RecommendedClubs from './views/recommend/RecommendedClubs';
import Settings from './views/settings/Settings';
import UserView from './views/user/User';

const trackingId =
  process.env.NODE_ENV === 'production' ? 'UA-142888065-1' : undefined;

interface AppProps {}

const HomeRedirect = () => {
  return <Redirect to="/clubs" />;
};

const forceOnboard = (
  user: User | null,
  userLoaded: boolean,
  route: JSX.Element
) => {
  if (userLoaded && user && user.onboardingVersion === 0) {
    return <Redirect to="/onboarding" />;
  }
  return route;
};

const forceOutOfOnboard = (
  user: User | null,
  userLoaded: boolean,
  route: JSX.Element
) => {
  if (userLoaded && (!user || user.onboardingVersion === 1)) {
    return <Redirect to="/clubs" />;
  }
  return route;
};

export function App(props: AppProps) {
  const cachedUserStr = localStorage.getItem(KEY_USER);
  let cachedUser: User | null = null;
  if (cachedUserStr) {
    cachedUser = JSON.parse(cachedUserStr);
  }
  const [user, setUser] = useState<User | null>(cachedUser);
  const [userLoaded, setLoadedUser] = useState<boolean>(false);
  const [docHeight, setDocHeight] = useState<number>(
    document.body.scrollHeight
  );

  useEffect(() => {
    // TODO: Remove this redirect
    if (window.location.hostname === 'caravanapp.ca') {
      window.location.href = 'https://caravan-node.herokuapp.com/clubs';
      return;
    }
    const getUserAsync = async () => {
      setLoadedUser(false);
      const userId = getCookie('userId');
      if (userId) {
        validateDiscordPermissions().then(res => {
          if (res.status === 200 || res.status === 500) {
            const dataTyped = res.data as { authRequired: boolean };
            if (dataTyped.authRequired) {
              const discordAuthUrl = getDiscordAuthUrl();
              window.location.href = discordAuthUrl;
            }
          }
        });
        const user = await getUser(userId);
        setUser(user);
        setLoadedUser(true);
        if (user) {
          localStorage.setItem(KEY_USER, JSON.stringify(user));
        } else {
          localStorage.removeItem(KEY_USER);
          console.info('Are you having fun messing with cookies? :)');
        }
      } else {
        setUser(null);
        setLoadedUser(true);
        localStorage.removeItem(KEY_USER);
      }
    };
    getUserAsync();
    // Handle the `state` query to verify login
    const queries = qs.parse(window.location.search);
    if (queries && queries.state) {
      // Someone tampered with the login, remove token
      if (queries.state !== localStorage.getItem(KEY_DISCORD_OAUTH_STATE)) {
        deleteCookie('userId');
      }
      localStorage.removeItem(KEY_DISCORD_OAUTH_STATE);
    }
    if (!getCookie('userId')) {
      clearStorageAuthState();
    }
    if (queries.ref && !getCookie('refClickComplete') && !getCookie('userId')) {
      const clubRegex = RegExp('/clubs/\\w+');
      const postRegex = RegExp('/posts/\\w+');
      const referralDestination: ReferralDestination = clubRegex.test(
        window.location.pathname
      )
        ? 'club'
        : postRegex.test(window.location.pathname)
        ? 'post'
        : 'home';
      const referralDestinationId: string | null | undefined =
        referralDestination === 'club'
          ? getClubIdFromPathname(window.location.pathname)
          : undefined;
      const referrerId = Array.isArray(queries.ref)
        ? queries.ref[0]
        : queries.ref;
      let utmSource = Array.isArray(queries.utm_source)
        ? queries.utm_source[0]
        : queries.utm_source;
      if (utmSource) {
        utmSource = getUtmSourceValue(utmSource);
      }
      handleReferral(
        referrerId,
        utmSource,
        referralDestination,
        referralDestinationId
      );
    }
  }, []);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <GAListener trackingId={trackingId}>
            {/* div exists for ReactResizeDetector to work */}
            <div>
              <Switch>
                <Route
                  exact
                  path="/"
                  render={props =>
                    forceOnboard(user, userLoaded, HomeRedirect())
                  }
                />
                <Route
                  exact
                  path="/clubs"
                  render={props =>
                    forceOnboard(
                      user,
                      userLoaded,
                      <Home {...props} user={user} userLoaded={userLoaded} />
                    )
                  }
                />
                <Route
                  exact
                  path="/clubs/create"
                  render={props =>
                    forceOnboard(
                      user,
                      userLoaded,
                      <CreateClub {...props} user={user} />
                    )
                  }
                />
                <Route
                  exact
                  path="/clubs/recommend"
                  render={props =>
                    forceOnboard(
                      user,
                      userLoaded,
                      <RecommendedClubs
                        {...props}
                        user={user}
                        userLoaded={userLoaded}
                      />
                    )
                  }
                />
                <Route
                  exact
                  path="/post/create"
                  render={props =>
                    forceOnboard(
                      user,
                      userLoaded,
                      <CreateShelf {...props} user={user} />
                    )
                  }
                />
                <Route
                  path="/posts/:id/edit"
                  render={props =>
                    forceOnboard(
                      user,
                      userLoaded,
                      <EditShelf {...props} user={user} />
                    )
                  }
                />
                <Route
                  path="/posts/:id"
                  render={props =>
                    forceOnboard(
                      user,
                      userLoaded,
                      <Post {...props} user={user} />
                    )
                  }
                />
                <Route
                  exact
                  path="/onboarding"
                  render={props =>
                    forceOutOfOnboard(
                      user,
                      userLoaded,
                      <Onboarding {...props} user={user} />
                    )
                  }
                />
                <Route
                  exact
                  path="/about"
                  render={props =>
                    forceOnboard(
                      user,
                      userLoaded,
                      <About {...props} user={user} />
                    )
                  }
                />
                <Route
                  exact
                  path="/privacy"
                  render={props =>
                    forceOnboard(
                      user,
                      userLoaded,
                      <Privacy {...props} user={user} />
                    )
                  }
                />
                <Route
                  exact
                  path="/settings"
                  render={props =>
                    forceOnboard(
                      user,
                      userLoaded,
                      <Settings {...props} user={user} />
                    )
                  }
                />
                <Route
                  path="/clubs/:id/manage-shelf"
                  render={props =>
                    forceOnboard(
                      user,
                      userLoaded,
                      <UpdateBook {...props} user={user} />
                    )
                  }
                />
                <Route
                  path="/clubs/:id"
                  render={props =>
                    forceOnboard(
                      user,
                      userLoaded,
                      <Club {...props} user={user} />
                    )
                  }
                />
                <Route
                  path="/user/:id"
                  render={props =>
                    forceOnboard(
                      user,
                      userLoaded,
                      <UserView {...props} user={user} />
                    )
                  }
                />
              </Switch>
              <ReactResizeDetector
                handleHeight
                onResize={(w, h) => setDocHeight(h)}
              />
            </div>
            <Footer docHeight={docHeight} />
          </GAListener>
        </Router>
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  );
}

export default App;
