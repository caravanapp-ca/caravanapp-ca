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

export interface AppProps {}

function HomeRedirect() {
  return <Redirect to="/club" />;
}

export function App(props: AppProps) {
  const user = useInitializeUser();
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomeRedirect} />
        <Route
          exact
          path="/club"
          render={props => <Home {...props} user={user} />}
        />
        <Route
          exact
          path="/club/create"
          render={props => <CreateClub {...props} user={user} />}
        />
        <Route
          path="/club/:id"
          render={props => <Club {...props} user={user} />}
        />
        <Route exact path="/findbooks" component={FindBooks} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
