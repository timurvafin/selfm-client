import React, { ReactNode, useCallback } from 'react';
import cs from 'classnames';
import { WorkspaceEntity } from '../../models/workspace';
import { DNDSourceItem, Droppable, DroppableComponentProps } from '../../vendor/dnd';
import { Shortcut, UIComponentType, WorkspaceTypes } from '../../common/constants';
import { useDispatch } from 'react-redux';
import { taskActions } from '../../models/task';


export interface Props {
  caption: string;
  onSelect: () => void;
  isSelected: boolean;
  icon: ReactNode;
  className?: string;
  workspace: WorkspaceEntity;
}

const SidebarLink = ({ caption, onSelect, isSelected, icon, className, isDraggingOver }: Props & DroppableComponentProps) => {
  const cls = cs('sidebar__link', className, {
    ['sidebar__link--selected']: isSelected,
    ['sidebar__project--dragging-over']: isDraggingOver,
  });

  return (
    <div
      className={cls}
      onClick={onSelect}
    >
      <div className="sidebar__link__icon">{icon}</div>
      <div className="sidebar__link__caption">{caption}</div>
    </div>
  );
};

const DroppableLink = (props: Props) => {
  const dispatch = useDispatch();
  const onDrop = useCallback((sourceItem: DNDSourceItem) => {
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
      // Disable moving in the same project
      isDisabled={props.workspace.type === WorkspaceTypes.PROJECT && props.isSelected}
      mode={'copy'}
      onDrop={onDrop}
    >
      <SidebarLink {...props} />
    </Droppable>
  );
};

export default DroppableLink;
