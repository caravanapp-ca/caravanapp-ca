import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import qs from 'query-string';
import CssBaseline from '@material-ui/core/CssBaseline';
import { clearAuthState, KEY_DISCORD_OAUTH_STATE } from './common/localStorage';
import { deleteCookie, getCookie } from './common/cookies';
import useInitializeUser from './common/useInitializeUser';
import Footer from './components/Footer';
import Club from './views/club/Club';
import CreateClub from './views/club/CreateClub';
import Home from './views/home/Home';
import FindBooks from './views/books/FindBooks';
import Privacy from './views/privacy/Privacy';
import UpdateBook from './views/club/UpdateBook';
import User from './views/user/User';

export interface AppProps {}

function HomeRedirect() {
  return <Redirect to="/clubs" />;
}

export function App(props: AppProps) {
  const user = useInitializeUser();
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
    <Router>
      <CssBaseline />
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
        <Route path="/user/:id" component={User} />
        <Route exact path="/findbooks" component={FindBooks} />
        <Route exact path="/privacy" component={Privacy} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
