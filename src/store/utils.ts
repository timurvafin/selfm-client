import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import { all, fork } from '@redux-saga/core/effects';
import { Model } from '../models/common';


export const makeReducer = (history, models: Model<any, any>[]) => {
  const reducers = models.reduce((map, model) => {
    map[model.namespace] = (state, action) => model.reduce(state, action);
    return map;
  }, {});

  return combineReducers({
    router: connectRouter(history),
    ...reducers,
  });
};

export const makeSagas = <State>(models: Model<any, any>[]) => {
  return function* () {
    yield all(models.map(model => fork(() => model.saga())));
  };
};