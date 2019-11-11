import cs from 'classnames';
import { WorkspaceEntity } from 'models/workspace';
import React, { ReactNode } from 'react';

import styles from './sidebar.scss';


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
  const cls = cs(styles.link, className, {
    [styles.linkSelected]: isSelected,
    [styles.linkDraggingOver]: isDraggingOver,
  });

  return (
    <div
      className={cls}
      onClick={onSelect}
    >
      <div className={styles.link__icon}>{icon}</div>
      <div className={styles.link__caption}>{caption}</div>
      {count && <div className={styles.link__count}>{count}</div>}
    </div>
  );
};

export default React.memo(SidebarLink);
