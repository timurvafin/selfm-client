import React from 'react';
import cn from 'classnames';
import { UIComponentType } from 'common/constants';
import { SortableElement } from 'vendor/dnd/react-dnd/sortable';
import TasksSection, { Props } from './TasksSection';
import * as styles from './task-sections.scss';


const DraggableTaskSection = (props: Props) => (
  <SortableElement
    index={props.index}
    id={props.id}
    type={UIComponentType.TASK_SECTION}
  >
    {({ setRef, isDragging }) => (
      <div
        ref={setRef}
        className={cn(styles.draggable, isDragging && styles.draggableDragging)}
      >
        <TasksSection {...props} />
      </div>
    )}
  </SortableElement>
);

export default DraggableTaskSection;