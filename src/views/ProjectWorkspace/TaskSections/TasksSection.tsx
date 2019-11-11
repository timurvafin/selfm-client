import cls from 'classnames';
import { stopPropagation } from 'common/utils/component';
import { CrossIcon, PlusIcon } from 'components/Icon';
import Menu from 'components/Menu';
import TextField from 'components/Textfield';
import { sectionActions, SectionEntity } from 'models/section';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sectionSelector, TaskUIEntity } from 'store/selectors';
import { ID } from 'common/types';
import { SortableTaskList } from 'views/Workspace';
import { taskActions } from 'models/task';
import { DraggableItem } from 'vendor/dnd/react-dnd';

import * as styles from './task-sections.scss';


export interface Props {
  id: ID;
  index: number;
  tasks: Array<TaskUIEntity>;
}

const TasksSection = ({ id, tasks }: Props) => {
  const section: SectionEntity = useSelector(state => sectionSelector(state, id));

  const dispatch = useDispatch();
  const update = useCallback((values) => {
    dispatch(sectionActions.update(id, values));
  }, [id]);
  const remove = useCallback(() => {
    dispatch(sectionActions.remove(id));
  }, [id]);
  const addTask = () => {
    // dispatch(TaskActions.create(projectId, section.id));
  };

  const onTaskMove = useCallback((sourceItem: DraggableItem, position: number) => {
    dispatch(taskActions.move(sourceItem.id, {
      sectionId: id,
      position,
    }));
  }, []);

  const menuItems = [
    { action: addTask, name: 'Add task', icon: <PlusIcon />, className: 'action--add' },
    { action: remove, name: 'Remove', icon: <CrossIcon />, className: 'action--remove' },
  ];

  const classNames = cls(styles, {
    // ['task-section--dragging']: isDragging,
  });

  return section && (
    <div className={classNames}>
      <div className={styles['header']}>
        <TextField
          transparent
          value={section.caption}
          onMouseDown={stopPropagation}
          className={styles['caption']}
          autoFocus={section.isNew}
          onChange={caption => update({ caption })}
        />
        <Menu items={menuItems} />
      </div>
      <SortableTaskList
        tasks={tasks}
        id={`task-list-${id}`}
        onTaskMove={onTaskMove}
        orderBy={'order'}
      />
    </div>
  );
};

export default React.memo(TasksSection);