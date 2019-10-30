import React, { useCallback } from 'react';
import { stopPropagation } from 'common/utils/component';
import TextField from 'components/Textfield';
import { useDispatch, useSelector } from 'react-redux';
import { sectionActions, SectionEntity } from 'store/models/section';
import Menu from 'components/Menu';
import { CrossIcon, PlusIcon } from 'components/Icon';
import { sectionSelector } from 'store/selectors';
import { ID } from '../../common/types';


const TasksSection = ({ id }: { id: ID }) => {
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

  return section && (
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
    </div>
  );
};

export default TasksSection;