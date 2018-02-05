import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import Routes from './routes'
import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createHashHistory'

const _history = createHistory()

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={_history}>
            <Routes/>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
)
