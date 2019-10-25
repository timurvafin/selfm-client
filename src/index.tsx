import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
// import Routes from './routes';
// import { ConnectedRouter } from 'react-router-redux';
// import createHistory from 'history/createHashHistory';
import PlanView from './views/PlanView';
import 'styles/common.scss';


// const _history = createHistory();

ReactDOM.render(
  <Provider store={store}>
    <div id={'app'}><PlanView /></div>
  </Provider>,
  document.getElementById('root')
);
