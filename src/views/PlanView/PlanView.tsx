import React from 'react';
import Sidebar from './Sidebar';
import WorkSpace from './WorkSpace';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import './style.scss';


const PlanView = () => (
  <DndProvider backend={HTML5Backend}>
    <div className="plan">
      <Sidebar />
      <WorkSpace />
    </div>
  </DndProvider>
);

export default PlanView;

