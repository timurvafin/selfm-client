import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { reducer, RootState, sagas } from './models';


export { RootState };
// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleWare = createSagaMiddleware();

const middlewares = [
  sagaMiddleWare,
];

const store = createStore(reducer, composeEnhancers(
  applyMiddleware(...middlewares),
));

sagaMiddleWare.run(sagas);

export default store;