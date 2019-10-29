import React from 'react';
import { HashRouter as Router } from "react-router-dom";
import PlanView from './views/PlanView';
import { useMountEffect } from './common/hooks';
import { actions as SectionsActions } from 'store/models/section';
import { actions as ProjectsActions } from 'store/models/project';
import { actions as TasksActions } from 'store/models/task';
import { useDispatch } from 'react-redux';

import 'styles/common.scss';


const App = () => {
  const dispatch = useDispatch();

  useMountEffect(() => {
    dispatch(SectionsActions.load());
    dispatch(ProjectsActions.load());
    dispatch(TasksActions.load());
  });

  return (
    <div id={'app'}>
      <Router>
        <PlanView />
      </Router>
    </div>
  );
};

export default App;