import React from 'react';
import { useMountEffect } from './common/hooks';
import { useDispatch } from 'react-redux';

import 'styles/common.scss';
import Sidebar from './views/Sidebar/Sidebar';
import WorkSpace from './views/Workspace/WorkSpace';
import { sectionActions } from './store/models/section';
import { projectActions } from './store/models/project';
import { taskActions } from './store/models/task';


const App = () => {
  const dispatch = useDispatch();

  useMountEffect(() => {
    dispatch(sectionActions.load());
    dispatch(projectActions.load());
    dispatch(taskActions.load());
  });

  return (
    <div id={'app'}>
      <Sidebar />
      <WorkSpace />
    </div>
  );
};

export default App;