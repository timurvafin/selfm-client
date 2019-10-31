import React, { useCallback } from 'react';
import { useMountEffect } from './common/hooks';
import { useDispatch } from 'react-redux';

import 'styles/common.scss';
import Sidebar from './views/Sidebar/Sidebar';
import Workspace from './views/Workspace/WorkSpace';
import { sectionActions } from './store/models/section';
import { projectActions } from './store/models/project';
import { taskActions } from './store/models/task';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { workspaceActions } from './store/models/workspace';
import { decodeDNDId } from './common/utils/common';


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
      <Workspace />
    </div>
  );
};

const withTaskDND = (App) => () => {
  const dispatch = useDispatch();

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source } = result;
      console.log(result);

      // drop nowere
      if (!destination) {
        return;
      }

      // position wasn't changed
      if (source.droppableId === destination.droppableId && destination.index === source.index) {
        return;
      }

      const draggableSource = decodeDNDId(result.draggableId);
      const droppableSource = decodeDNDId(source.droppableId);
      const droppableTarget = decodeDNDId(destination.droppableId);

      const sourceItem = {
        scope: droppableSource.scope,
        code: draggableSource.code,
        type: draggableSource.type,
        index: source.index,
      };

      const destinationItem = {
        scope: droppableTarget.scope,
        code: droppableTarget.code,
        type: droppableTarget.type,
        index: destination.index,
      };

      dispatch(workspaceActions.performDND(sourceItem, destinationItem));
    },
    [],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <App />
    </DragDropContext>
  );
};

export default withTaskDND(App);