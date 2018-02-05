import React from 'react'
import {Route} from 'react-router'
import './styles/common.scss'
import PlanView from './views/plan'
import Header from './views/header'

export default class Routes extends React.Component {
    render() {
        return <div id="app">
            <Header />
            <Route path="/" component={PlanView}/>
        </div>
    }
}