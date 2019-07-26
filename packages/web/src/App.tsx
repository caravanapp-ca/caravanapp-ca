import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import ReactResizeDetector from 'react-resize-detector';
import qs from 'query-string';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { User } from '@caravan/buddy-reading-types';
import Footer from './components/Footer';
import Club from './views/club/Club';
import CreateClub from './views/club/CreateClub';
import Home from './views/home/Home';
import Onboarding from './views/onboarding/Onboarding';
import Privacy from './views/privacy/Privacy';
import UpdateBook from './views/club/UpdateBook';
import UserView from './views/user/User';
import {
  clearStorageAuthState,
  KEY_DISCORD_OAUTH_STATE,
  KEY_USER,
  KEY_REFERRER_USER_ID,
} from './common/localStorage';
import { deleteCookie, getCookie, setCookie } from './common/cookies';
import { GAListener } from './common/GAListener';
import theme from './theme';
import { getUser } from './services/user';
import { handleReferral } from './services/referral';

const trackingId =
  process.env.NODE_ENV === 'production' ? 'UA-142888065-1' : undefined;

interface AppProps {}

const HomeRedirect = () => {
  return <Redirect to="/clubs" />;
};

const forceOnboard = (user: User | null, route: JSX.Element) => {
  if (user && user.onboardingVersion === 0) {
    return <Redirect to="/onboarding" />;
  }
  return route;
};

const forceOutOfOnboard = (user: User | null, route: JSX.Element) => {
  if (!user || user.onboardingVersion === 1) {
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
    const getUserAsync = async () => {
      const userId = getCookie('userId');
      if (userId) {
        getUser(userId).then(async user => {
          if (user) {
            await setUser(user);
            setLoadedUser(true);
            localStorage.setItem(KEY_USER, JSON.stringify(user));
          } else {
            await setUser(null);
            setLoadedUser(true);
            localStorage.removeItem(KEY_USER);
            console.info('Are you having fun messing with cookies? :)');
          }
        });
      } else {
        await setUser(null);
        setLoadedUser(true);
        localStorage.removeItem(KEY_USER);
      }
    };
    getUserAsync();
  }, []);

  // Handle the `state` query to verify login
  useEffect(() => {
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
    if (
      window.location.href.includes('?ref=') &&
      !getCookie('compRef') &&
      !getCookie('userId')
    ) {
      const referrerId = window.location.href.split('?ref=')[1];
      handleReferral(referrerId);
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
                  render={props => forceOnboard(user, HomeRedirect())}
                />
                <Route
                  exact
                  path="/clubs"
                  render={props =>
                    forceOnboard(
                      user,
                      <Home {...props} user={user} userLoaded={userLoaded} />
                    )
                  }
                />
                <Route
                  exact
                  path="/clubs/create"
                  render={props =>
                    forceOnboard(user, <CreateClub {...props} user={user} />)
                  }
                />
                <Route
                  exact
                  path="/onboarding"
                  render={props =>
                    forceOutOfOnboard(
                      user,
                      <Onboarding {...props} user={user} />
                    )
                  }
                />
                <Route
                  exact
                  path="/privacy"
                  render={props => forceOnboard(user, <Privacy />)}
                />
                <Route
                  path="/clubs/:id/manage-shelf"
                  render={props =>
                    forceOnboard(user, <UpdateBook {...props} user={user} />)
                  }
                />
                <Route
                  path="/clubs/:id"
                  render={props =>
                    forceOnboard(user, <Club {...props} user={user} />)
                  }
                />
                <Route
                  path="/user/:id"
                  render={props =>
                    forceOnboard(user, <UserView {...props} user={user} />)
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
