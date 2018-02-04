import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducer from './reducers'
import sagas from './sagas/root'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const sagaMiddleWare   = createSagaMiddleware()

const store = createStore(reducer, composeEnhancers(
    applyMiddleware(sagaMiddleWare)
))

sagaMiddleWare.run(sagas)

export default store