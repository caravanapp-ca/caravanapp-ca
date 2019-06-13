import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './views/home/Home';
import CreateClub from './views/club/CreateClub';
import Footer from './components/Footer';

export interface AppProps {}

export function App(props: AppProps) {
  return (
    <Router>
      <div>
        <Header />
        <Route exact path="/" component={Home} />
        <Route exact path="/club/create" component={CreateClub} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
