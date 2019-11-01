import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { models, ModelsState } from '../models';
import { createHashHistory as createHistory } from 'history';
import { routerMiddleware, RouterState } from 'connected-react-router';
import { makeReducer, makeSagas } from './utils';

export const history = createHistory();

export const reducer = makeReducer(history, models);
export const sagas = makeSagas(models);

export type RootState = ModelsState & { router: RouterState };
export { ModelsState };
// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleWare = createSagaMiddleware();

const middlewares = [
  sagaMiddleWare,
  routerMiddleware(history),
];

const store = createStore(reducer, composeEnhancers(
  applyMiddleware(...middlewares),
));

sagaMiddleWare.run(sagas);

export default store;