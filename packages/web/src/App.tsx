import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './views/home/Home';
import CreateClub from './views/club/CreateClub';
import Footer from './components/Footer';
import useInitializeUser from './common/useInitializeUser';

export interface AppProps {}

export function App(props: AppProps) {
  const user = useInitializeUser();
  return (
    <Router>
      <div>
        <Route
          exact
          path="/"
          render={props => <Home {...props} user={user} />}
        />
        <Route exact path="/club/create" component={CreateClub} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
