import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import qs from 'query-string';
import CssBaseline from '@material-ui/core/CssBaseline';
import Footer from './components/Footer';
import Club from './views/club/Club';
import CreateClub from './views/club/CreateClub';
import Home from './views/home/Home';
import Onboarding from './views/onboarding/Onboarding';
import FindBooks from './views/books/FindBooks';
import Privacy from './views/privacy/Privacy';
import UpdateBook from './views/club/UpdateBook';
import User from './views/user/User';
import { ThemeProvider } from '@material-ui/styles';
import { clearAuthState, KEY_DISCORD_OAUTH_STATE } from './common/localStorage';
import { deleteCookie, getCookie } from './common/cookies';
import useUser from './common/useInitializeUser';
import { GAListener } from './common/GAListener';
import theme from './theme';

const trackingId =
  process.env.NODE_ENV === 'production' ? 'UA-142888065-1' : undefined;

interface AppProps {}

const HomeRedirect = () => {
  return <Redirect to="/clubs" />;
};

export function App(props: AppProps) {
  const user = useUser();

  // Handle the `state` query to verify login
  useEffect(() => {
    const queries = qs.parse(window.location.search);
    if (queries && queries.state) {
      // Someone tampered with the login, remove token
      if (queries.state !== localStorage.getItem(KEY_DISCORD_OAUTH_STATE)) {
        deleteCookie('token');
      }
      localStorage.removeItem(KEY_DISCORD_OAUTH_STATE);
    }
    if (!getCookie('token')) {
      clearAuthState();
    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <GAListener trackingId={trackingId}>
          <Switch>
            <Route exact path="/" component={HomeRedirect} />
            <Route
              exact
              path="/clubs"
              render={props => <Home {...props} user={user} />}
            />
            <Route
              exact
              path="/clubs/create"
              render={props => <CreateClub {...props} user={user} />}
            />
            <Route
              path="/clubs/:id/updatebook"
              render={props => <UpdateBook {...props} user={user} />}
            />
            <Route
              path="/clubs/:id"
              render={props => <Club {...props} user={user} />}
            />
            <Route
              path="/onboarding"
              render={props => <Onboarding {...props} user={user} />}
            />
            <Route path="/user/:id" component={User} />
            <Route exact path="/findbooks" component={FindBooks} />
            <Route exact path="/privacy" component={Privacy} />
          </Switch>
          <Footer />
        </GAListener>
      </Router>
    </ThemeProvider>
  );
}

export default App;
