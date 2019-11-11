import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { taskActions } from '../../../models/task';
import { workspaceActions } from '../../../models/workspace';
import { TaskUIEntity } from '../../../store/selectors';


const useActions = ({ id, isOpen, isSelected, completed }: TaskUIEntity) => {
  const dispatch = useDispatch();

  return {
    update: useCallback((values) => {
      dispatch(taskActions.update(id, values));
    }, [id]),
    updateCaption: useCallback((caption) => {
      dispatch(taskActions.updateCaption(id, caption));
    }, [id]),
    setComplete: useCallback((completed) => {
      dispatch(taskActions.update(id, { completed }));
    }, [id, completed]),
    setOpen: useCallback((value) => {
      isOpen !== value && dispatch(workspaceActions.setTaskOpen(id, value));
    }, [isOpen]),
    setSelected: useCallback((value) => {
      value !== isSelected && dispatch(workspaceActions.setTaskSelected(id, value));
    }, [isSelected]),
    createTodo: useCallback(() => {
      dispatch(taskActions.createTodo(id));
    }, [id]),
  };
};

export default useActions;