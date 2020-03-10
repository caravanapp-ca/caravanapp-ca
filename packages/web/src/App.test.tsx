import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

describe('basic app tests', () => {
  it('can run a test', () => {
    expect(2 + 2).toEqual(4);
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
