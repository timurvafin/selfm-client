import React from 'react'
import {HashRouter as Router, Route, Link} from 'react-router-dom';
import PlanView from './views/plan'

import './styles/common.scss'

export default class extends React.Component {
    render() {
        return <Router>
            <div>
                <Route path="/" component={PlanView}/>
            </div>
        </Router>;
    }
}