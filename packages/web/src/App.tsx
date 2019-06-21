import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import Footer from './components/Footer';
import Home from './views/home/Home';
import Club from './views/club/Club';
import CreateClub from './views/club/CreateClub';
import FindBooks from './views/books/FindBooks';
import useInitializeUser from './common/useInitializeUser';
import UpdateBook from './views/club/UpdateBook';
import Privacy from './views/privacy/Privacy';

export interface AppProps {}

function HomeRedirect() {
  return <Redirect to="/clubs" />;
}

export function App(props: AppProps) {
  const user = useInitializeUser();
  return (
    <Router>
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
        <Route exact path="/findbooks" component={FindBooks} />
        <Route exact path="/privacy" component={Privacy} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
