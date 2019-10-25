import TaskList from '../TaskList';
import React, { useCallback } from 'react';
import { SectionModel } from '../../store';
import { ID } from '../../common/types';
import { stopPropagation } from '../../common/utils/component';
import TextField from '../../components/Textfield';
import { useDispatch } from 'react-redux';
import * as SectionsActions from '../../store/actions/sections';
import Menu from '../Menu';
import { CrossIcon, PlusIcon } from '../../components/Icon';
import * as TaskActions from '../../store/actions/tasks';


const TasksSection = ({ projectId, section }: { projectId: ID; section: SectionModel }) => {
  const dispatch = useDispatch();
  const update = useCallback((values) => {
    dispatch(SectionsActions.update(section.id, values));
  }, [section.id]);
  const remove = useCallback(() => {
    dispatch(SectionsActions.remove(section.id));
  }, [section.id]);
  const addTask = () => {
    dispatch(TaskActions.create(projectId, section.id));
  };

  const menuItems = [
    { action: addTask, name: 'Add task', icon: <PlusIcon />, className: 'action--add' },
    { action: remove, name: 'Remove', icon: <CrossIcon />, className: 'action--remove' },
  ];

  return (
    <div className="task-section">
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
        projectId={projectId}
        sectionId={section.id}
      />
    </div>
  );
};

export default TasksSection;