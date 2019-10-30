import React from 'react';
import {
  Switch,
  Route
} from "react-router-dom";

import Project from '../Project';
import { Shortcuts, WorkspaceTypes } from 'common/constants';

import './workspace.scss';
import Shortcut from './ShortcutWorkspace';


const WorkSpace = () => (
  <div className="workspace-container">
    <Switch>
      <Route path={`/${WorkspaceTypes.SHORTCUT}/${Shortcuts.INBOX}`}>
        <Shortcut id={Shortcuts.INBOX} />
      </Route>
      <Route path={`/${WorkspaceTypes.SHORTCUT}/${Shortcuts.TODAY}`}>
        <Shortcut id={Shortcuts.TODAY} />
      </Route>
      <Route path={`/${WorkspaceTypes.SHORTCUT}/${Shortcuts.PLANS}`}>
        <Shortcut id={Shortcuts.PLANS} />
      </Route>
      <Route path={`/${WorkspaceTypes.SHORTCUT}/${Shortcuts.ANYTIME}`}>
        <Shortcut id={Shortcuts.ANYTIME} />
      </Route>
      <Route path={`/${WorkspaceTypes.SHORTCUT}/${Shortcuts.SOMEDAY}`}>
        <Shortcut id={Shortcuts.SOMEDAY} />
      </Route>
      <Route path={`/${WorkspaceTypes.PROJECT}/:id`}>
        { ({ match }) => <Project id={match.params.id} />}
      </Route>
    </Switch>
  </div>
);

export default WorkSpace;

