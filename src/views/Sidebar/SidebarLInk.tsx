import React, { ReactNode } from 'react';
import cs from 'classnames';
import { WorkspaceEntity } from '../../store/models/workspace';
import asDroppable from './asDroppable';


export interface Props {
  caption: string;
  onSelect: () => void;
  isSelected: boolean;
  icon: ReactNode;
  className?: string;
  workspace: WorkspaceEntity;
  isDraggingOver?: boolean;
}

const SidebarLink = ({ caption, onSelect, isSelected, icon, className, isDraggingOver }: Props) => {
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

export default asDroppable(SidebarLink);
