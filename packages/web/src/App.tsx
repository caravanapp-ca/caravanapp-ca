import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './views/home/Home';
import Footer from './components/Footer';
import useInitializeUser from './common/useInitializeUser';

export interface AppProps {}

export function App(props: AppProps) {
  const user = useInitializeUser();
  return (
    <Router>
      <div>
        <Header />
        <Route
          exact
          path="/"
          render={props => <Home {...props} user={user} />}
        />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
