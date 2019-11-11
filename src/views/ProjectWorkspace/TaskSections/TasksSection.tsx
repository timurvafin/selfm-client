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
import { DropResult } from 'vendor/dnd/react-dnd/sortable';
import { useSelectedWorkspace } from '../../../common/hooks';

import * as styles from './task-sections.scss';


export interface Props {
  id: ID;
  index: number;
  tasks: Array<TaskUIEntity>;
}

const TasksSection = ({ id, tasks }: Props) => {
  const section: SectionEntity = useSelector(state => sectionSelector(state, id));
  const workspace = useSelectedWorkspace();

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

  const onTaskDrop = useCallback((taskId: ID, dropResult: DropResult) => {
    if (dropResult.isNew) {
      dispatch(taskActions.move(taskId, {
        sectionId: id,
      }));
    }

    dispatch(taskActions.reorder(dropResult.newOrder, 'order'));
  }, [id]);

  const createTask = useCallback((caption) => {
    dispatch(taskActions.create(workspace, { caption, sectionId: id }));
  }, []);

  const menuItems = [
    { action: addTask, name: 'Add task', icon: <PlusIcon />, className: 'action--add' },
    { action: remove, name: 'Remove', icon: <CrossIcon />, className: 'action--remove' },
  ];

  const classNames = cls(styles, {
    // ['task-section--dragging']: isDragging,
  });

  return (
    <div className={classNames}>
      { section && (
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
      )}
      <SortableTaskList
        tasks={tasks}
        id={id}
        onTaskDrop={onTaskDrop}
        orderBy={'order'}
        onTaskCreate={createTask}
      />
    </div>
  );
};

export default React.memo(TasksSection);