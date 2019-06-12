import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './views/home/Home';
import Club from './views/club/Club';
import Footer from './components/Footer';

export interface AppProps {}

export function App(props: AppProps) {
  return (
    <Router>
      <div>
        <Header />
        <Route exact path="/" component={Home} />
        <Route path="/club" component={Club} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
