import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Shortcut, UIComponentType, WorkspaceTypes } from 'common/constants';
import { taskActions } from 'models/task';
import { DraggableItem, Droppable } from 'vendor/dnd/react-dnd';
import SidebarLink, { Props } from './SidebarLink';


const DroppableLink = ({ type, ...props }: Props & { type: UIComponentType }) => {
  const dispatch = useDispatch();
  const onDrop = useCallback((sourceItem: DraggableItem) => {
    if (sourceItem.type === UIComponentType.TASK) {
      if (props.workspace.type === WorkspaceTypes.PROJECT) {
        dispatch(taskActions.move(sourceItem.id, { parentId: props.workspace.code, sectionId: null }));
      }

      if (props.workspace.type === WorkspaceTypes.SHORTCUT) {
        dispatch(taskActions.setShortcut(sourceItem.id, (props.workspace.code as Shortcut)));
      }
    }
  }, [props.workspace.type, props.workspace.code]);

  return (
    <Droppable
      id={`${props.workspace.type}-${props.workspace.code}`}
      type={type}
      // Disable move task to the same workspace
      canDrop={() => !props.isSelected}
      onDrop={onDrop}
      accept={UIComponentType.TASK}
    >
      {({ setRef, isOver }) => (
        <div ref={setRef}>
          <SidebarLink
            {...props}
            isDraggingOver={isOver}
          />
        </div>
      )}
    </Droppable>
  );
};

export default DroppableLink;