import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Header from './components/Header';
import Home from './views/home/Home';
import Club from './views/club/Club';
import Footer from './components/Footer';

export interface AppProps {}

function HomeRedirect() {
  return <Redirect to="/club" />
}

export function App(props: AppProps) {
  return (
    <Router>
      <div>
        <Header />
        <Route exact path="/" component={HomeRedirect} />
        <Route exact path="/club" component={Home} />
        <Route path="/club/:id" component={Club} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
