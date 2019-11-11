import React from 'react';
import {
  Switch,
  Route
} from "react-router-dom";

import ProjectWorkspace from '../ProjectWorkspace';
import { Shortcut, WorkspaceTypes } from 'common/constants';

import {
  AnytimeWorkspace,
  // SomedayWorkspace,
  TodayWorkspace,
} from '../ShortcutWorkspace';
import WorkspaceActions from './WorkspaceActions';
import styles from './workspace.scss';


const WorkspaceRouter = () => (
  <div className={styles.container}>
    <Switch>
      <Route path={`/${WorkspaceTypes.SHORTCUT}/${Shortcut.INBOX}`}>
        <AnytimeWorkspace code={Shortcut.INBOX} />
      </Route>
      <Route path={`/${WorkspaceTypes.SHORTCUT}/${Shortcut.TODAY}`}>
        <TodayWorkspace code={Shortcut.TODAY} />
      </Route>
      <Route path={`/${WorkspaceTypes.SHORTCUT}/${Shortcut.PLANS}`}>
        <AnytimeWorkspace code={Shortcut.PLANS} />
      </Route>
      <Route path={`/${WorkspaceTypes.SHORTCUT}/${Shortcut.ANYTIME}`}>
        <AnytimeWorkspace code={Shortcut.ANYTIME} />
      </Route>
      <Route path={`/${WorkspaceTypes.SHORTCUT}/${Shortcut.SOMEDAY}`}>
        <AnytimeWorkspace code={Shortcut.SOMEDAY} />
      </Route>
      <Route path={`/${WorkspaceTypes.PROJECT}/:id`}>
        { ({ match }) => <ProjectWorkspace id={match.params.id} />}
      </Route>
    </Switch>
    <WorkspaceActions />
  </div>
);

export default WorkspaceRouter;

