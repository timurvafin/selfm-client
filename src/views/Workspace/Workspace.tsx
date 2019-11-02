import React from 'react';
import {
  Switch,
  Route
} from "react-router-dom";

import ProjectWorkspace from '../ProjectWorkspace';
import { Shortcut, WorkspaceTypes } from 'common/constants';

import ShortcutWorkspace from '../ShortcutWorkspace';
import WorkspaceActions from './WorkspaceActions';
import './workspace.scss';


const WorkspaceRouter = () => (
  <div className="workspace-container">
    <Switch>
      <Route path={`/${WorkspaceTypes.SHORTCUT}/${Shortcut.INBOX}`}>
        <ShortcutWorkspace code={Shortcut.INBOX} />
      </Route>
      <Route path={`/${WorkspaceTypes.SHORTCUT}/${Shortcut.TODAY}`}>
        <ShortcutWorkspace code={Shortcut.TODAY} />
      </Route>
      <Route path={`/${WorkspaceTypes.SHORTCUT}/${Shortcut.PLANS}`}>
        <ShortcutWorkspace code={Shortcut.PLANS} />
      </Route>
      <Route path={`/${WorkspaceTypes.SHORTCUT}/${Shortcut.ANYTIME}`}>
        <ShortcutWorkspace code={Shortcut.ANYTIME} />
      </Route>
      <Route path={`/${WorkspaceTypes.SHORTCUT}/${Shortcut.SOMEDAY}`}>
        <ShortcutWorkspace code={Shortcut.SOMEDAY} />
      </Route>
      <Route path={`/${WorkspaceTypes.PROJECT}/:id`}>
        { ({ match }) => <ProjectWorkspace id={match.params.id} />}
      </Route>
    </Switch>
    <WorkspaceActions />
  </div>
);

export default WorkspaceRouter;

