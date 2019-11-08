import cs from 'classnames';
import { Shortcut, UIComponentType, WorkspaceTypes } from 'common/constants';
import { taskActions } from 'models/task';
import { WorkspaceEntity } from 'models/workspace';
import React, { ReactNode, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Droppable, DraggableItem } from 'vendor/dnd/react-dnd';


export interface Props {
  caption: string;
  onSelect: () => void;
  isSelected: boolean;
  icon: ReactNode;
  className?: string;
  workspace: WorkspaceEntity;
  count?: number;
  isDraggingOver?: boolean;
}

const SidebarLink = ({ caption, onSelect, isSelected, icon, className, count, isDraggingOver }: Props) => {
  const cls = cs('sidebar-link', className, {
    ['sidebar-link--selected']: isSelected,
    ['sidebar-link--dragging-over']: isDraggingOver,
  });

  return (
    <div
      className={cls}
      onClick={onSelect}
    >
      <div className="sidebar-link__icon">{icon}</div>
      <div className="sidebar-link__caption">{caption}</div>
      {count && <div className="sidebar-link__count">{count}</div>}
    </div>
  );
};

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
