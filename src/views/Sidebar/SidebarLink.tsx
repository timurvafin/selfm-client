import cs from 'classnames';
import { WorkspaceEntity } from 'models/workspace';
import React, { ReactNode } from 'react';


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

export default React.memo(SidebarLink);
