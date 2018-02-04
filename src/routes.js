import React from 'react'
import {Route} from 'react-router'
import PlanView from './views/plan'

import './styles/common.scss'

export default class Routes extends React.Component {
    render() {
        return <div>
            <Route path="/" component={PlanView}/>
        </div>
    }
}