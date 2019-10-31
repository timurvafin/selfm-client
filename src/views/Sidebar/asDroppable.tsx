import React from 'react';
import { Droppable, DroppableStateSnapshot } from 'react-beautiful-dnd';
import SidebarLinkComp, { Props } from './SidebarLInk';
import { encodeDroppableId } from '../../common/utils/common';


const asDroppable = (SidebarLInk: typeof SidebarLinkComp): typeof SidebarLinkComp => (props: Props) => (
  <Droppable
    type={'TASK'}
    droppableId={encodeDroppableId('sidebar', props.workspace.code, props.workspace.type)}
  >
    {(provided, snapshot: DroppableStateSnapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        <SidebarLInk
          {...props}
          isDraggingOver={snapshot.isDraggingOver}
        />
      </div>
    )}
  </Droppable>
);

export default asDroppable;