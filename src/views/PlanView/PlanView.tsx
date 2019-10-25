import React from 'react';
import Sidebar from './Sidebar';
import WorkSpace from './WorkSpace';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import * as SectionsActions from 'store/actions/sections';

import './style.scss';
import { useMountEffect } from '../../common/hooks';
import { useDispatch } from 'react-redux';


const PlanView = () => {
  const dispatch = useDispatch();

  useMountEffect(() => {
    dispatch(SectionsActions.load());
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

