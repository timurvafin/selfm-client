import React from 'react';
import { useMountEffect } from './common/hooks';
import { useDispatch } from 'react-redux';

import 'styles/common.scss';
import Sidebar from './views/Sidebar/Sidebar';
import WorkspaceRouter from './views/Workspace/WorkSpace';
import { sectionActions } from './models/section';
import { projectActions } from './models/project';
import { taskActions } from './models/task';
import { DNDContainer } from './vendor/dnd/react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


const App = () => {
  const dispatch = useDispatch();

  useMountEffect(() => {
    dispatch(sectionActions.load());
    dispatch(projectActions.load());
    dispatch(taskActions.load());
  });

  return (
    <DNDContainer backend={HTML5Backend}>
      <div id={'app'}>
        <Sidebar />
        <WorkspaceRouter />
      </div>
    </DNDContainer>
  );
};

export default App;