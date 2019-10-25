import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
// import Routes from './routes';
// import { ConnectedRouter } from 'react-router-redux';
// import createHistory from 'history/createHashHistory';
import App from './App';


// const _history = createHistory();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
