import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Header from './components/Header';
import Home from './views/home/Home';
import Club from './views/club/Club';
import CreateClub from './views/club/CreateClub';
import Footer from './components/Footer';
import useInitializeUser from './common/useInitializeUser';

export interface AppProps {}

function HomeRedirect() {
  return <Redirect to="/club" />;
}

export function App(props: AppProps) {
  const user = useInitializeUser();
  return (
    <Router>
      <div>
        <Header />
        <Route exact path="/" component={HomeRedirect} />
        <Route exact path="/club" component={Home} />
        <Route
          path="/club/:id"
          render={props => <Club {...props} user={user} />}
        />
        <Route
          exact
          path="/club/create"
          render={props => <CreateClub {...props} user={user} />}
        />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
