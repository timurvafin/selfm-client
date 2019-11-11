import React from 'react';
import {
  Switch,
  Route
} from "react-router-dom";

import ProjectWorkspace from '../ProjectWorkspace';
import { Shortcut, WorkspaceTypes } from 'common/constants';

import {
  BasicWorkspace,
  // SomedayWorkspace,
  TodayWorkspace,
} from '../ShortcutWorkspace';
import WorkspaceActions from './WorkspaceActions';
import styles from './workspace.scss';


const WorkspaceRouter = () => (
  <div className={styles.container}>
    <Switch>
      <Route path={`/${WorkspaceTypes.SHORTCUT}/${Shortcut.INBOX}`}>
        <BasicWorkspace code={Shortcut.INBOX} />
      </Route>
      <Route path={`/${WorkspaceTypes.SHORTCUT}/${Shortcut.TODAY}`}>
        <TodayWorkspace code={Shortcut.TODAY} />
      </Route>
      <Route path={`/${WorkspaceTypes.SHORTCUT}/${Shortcut.PLANS}`}>
        <BasicWorkspace code={Shortcut.PLANS} />
      </Route>
      <Route path={`/${WorkspaceTypes.SHORTCUT}/${Shortcut.ANYTIME}`}>
        <BasicWorkspace code={Shortcut.ANYTIME} />
      </Route>
      <Route path={`/${WorkspaceTypes.SHORTCUT}/${Shortcut.SOMEDAY}`}>
        <BasicWorkspace code={Shortcut.SOMEDAY} />
      </Route>
      <Route path={`/${WorkspaceTypes.PROJECT}/:id`}>
        { ({ match }) => <ProjectWorkspace id={match.params.id} />}
      </Route>
    </Switch>
    <WorkspaceActions />
  </div>
);

export default WorkspaceRouter;

