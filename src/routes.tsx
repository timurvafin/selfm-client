import React from 'react';
import { Route } from 'react-router';
import './styles/common.scss';
import PlanView from './views/PlanView';
import ProjectVis from './views/vis/ProjectVis';
import Header from './views/header';


export default class Routes extends React.Component {
  render() {
    return (
      <div id="app">
        <Header />
        <Route
          path="/"
          exact
          component={PlanView}
        />
        <Route
          path="/vis"
          component={ProjectVis}
        />
      </div>
    );
  }
}