import React from 'react';
import {
  Switch,
  Route
} from "react-router-dom";

import Project from '../Project';
import { Shortcuts } from '../../common/constants';


const WorkSpace = () => (
  <div className="workspace">
    <Switch>
      <Route path={`/${Shortcuts.INBOX}`}>
        { ({ match }) => <Project id={match.params.id} />}
      </Route>
      <Route path={`/${Shortcuts.TODAY}`}>
        { ({ match }) => <Project id={match.params.id} />}
      </Route>
      <Route path={`/${Shortcuts.PLANS}`}>
        { ({ match }) => <Project id={match.params.id} />}
      </Route>
      <Route path={`/${Shortcuts.ANYTIME}`}>
        { ({ match }) => <Project id={match.params.id} />}
      </Route>
      <Route path={`/${Shortcuts.SOMEDAY}`}>
        { ({ match }) => <Project id={match.params.id} />}
      </Route>
      <Route path="/project/:id">
        { ({ match }) => <Project id={match.params.id} />}
      </Route>
    </Switch>
  </div>
);

export default WorkSpace;

