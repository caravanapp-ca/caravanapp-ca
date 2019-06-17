import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './views/home/Home';
import CreateClub from './views/club/CreateClub';
import FindBooks from './views/books/FindBooks';

export interface AppProps {}

export function App(props: AppProps) {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route exact path="/club/create" component={CreateClub} />
        <Route exact path="/findbooks" component={FindBooks} />
      </div>
    </Router>
  );
}

export default App;
