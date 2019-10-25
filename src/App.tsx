import React from 'react';
import PlanView from './views/PlanView';
import { useMountEffect } from './common/hooks';
import * as SectionsActions from './store/actions/sections';
import * as ProjectsActions from './store/actions/projects';
import * as TasksActions from './store/actions/tasks';
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
    <div id={'app'}><PlanView /></div>
  );
};

export default App;