import React from 'react';
import { useDispatch } from 'react-redux';
import * as ProjectActions from 'store/actions/projects';
import Sidebar from './Sidebar';
import WorkSpace from './WorkSpace';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import './style.scss';
import { useMountEffect } from '../../utils/hooks';


const PlanView = () => {
  const dispatch = useDispatch();

  useMountEffect(() => {
    dispatch(ProjectActions.load());
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="plan">
        <Sidebar />
        <WorkSpace />
      </div>
    </DndProvider>
  );
};

export default PlanView;

