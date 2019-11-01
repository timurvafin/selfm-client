import React, { useCallback } from 'react';
import cls from 'classnames';
import { stopPropagation } from 'common/utils/component';
import TextField from 'components/Textfield';
import { useDispatch, useSelector } from 'react-redux';
import { sectionActions, SectionEntity } from 'models/section';
import Menu from 'components/Menu';
import { CrossIcon, PlusIcon } from 'components/Icon';
import { sectionSelector, TaskUIEntity } from 'store/selectors';
import { ID } from '../../common/types';
import TaskList from '../TaskList';
import Draggable from '../../vendor/dnd/beautiful-dnd/Draggable';
import { DraggableComponentProps } from '../../vendor/dnd';
import { UIComponentType } from '../../common/constants';


interface Props {
  id: ID;
  index: number;
  tasks: Array<TaskUIEntity>;
}

const TasksSection = ({ id, tasks, isDragging }: Props & DraggableComponentProps) => {
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

  const menuItems = [
    { action: addTask, name: 'Add task', icon: <PlusIcon />, className: 'action--add' },
    { action: remove, name: 'Remove', icon: <CrossIcon />, className: 'action--remove' },
  ];

  const classNames = cls('task-section', {
    ['task-section--dragging']: isDragging,
  });

  return section && (
    <div className={classNames}>
      <div className="task-section__header">
        <TextField
          transparent
          value={section.caption}
          onMouseDown={stopPropagation}
          className="task-section__caption"
          autoFocus={section.isNew}
          onChange={caption => update({ caption })}
        />
        <Menu items={menuItems} />
      </div>
      <TaskList
        tasks={tasks}
        sectionId={section.id}
      />
    </div>
  );
};

const DraggableTaskSection = (props: Props) => (
  <Draggable
    index={props.index}
    id={props.id}
    type={UIComponentType.TASK_SECTION}
  >
    <TasksSection {...props} />
  </Draggable>
);

export default DraggableTaskSection;