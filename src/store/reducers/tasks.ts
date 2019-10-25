import * as Actions from '../actions/tasks';
import { TaskModel } from '../index';
import { removeById, uniqueById, updateById } from '../../common/utils/collection';
import { ID } from '../../common/types';


export type TasksState = {
  entities: Array<TaskModel>;
  ui: {
    openId?: ID;
    selectedId?: ID;
  };
}

const initialState: TasksState = {
  entities: [],
  ui: {
    openId: null,
    selectedId: null,
  },
};

const defaultTaskFields = {
  caption: '',
  open: false,
  selected: false,
  progress: 0,
  todos: [],
};

const entitiesReducer = (tasks: Array<TaskModel>, action) => {
  switch (action.type) {
    case Actions.TASKS_RECEIVE:
      return uniqueById([...tasks, ...action.tasks]);
    case Actions.TASKS_ADD:
      return [...tasks, { ...defaultTaskFields, ...action.fields }];
    case Actions.TASKS_UPDATE:
      return updateById(tasks, action.id, action.values);
    case Actions.TASKS_REORDER:
      return tasks.map(task => {
        if (action.ids.includes(task.id)) {
          const order = action.ids.findIndex(id => task.id === id);

          return { ...task, order };
        }

        return task;
      });
    case Actions.TASKS_REMOVE:
      return removeById(tasks, action.id);
    case Actions.TASKS_TOGGLE:
      return updateById(tasks, action.id, { complete: action.complete });
    case Actions.TASKS_ADD_TODO:
      return updateById(tasks, action.taskId, task => ({
          ...task,
          todoList: [...task.todoList, action.fields],
        }));
    case Actions.TASKS_UPDATE_TODO:
      return updateById(tasks, action.taskId, task => ({
          ...task,
          todoList: updateById(task.todoList, action.todoId, action.fields),
        }));
    case Actions.TASKS_REMOVE_TODO:
      return updateById(tasks, action.taskId, task => ({
          ...task,
          todoList: task.todoList.filter(todo => todo.id !== action.todoId),
        }));
    default:
      return tasks;
  }
};

const uiReducer = (state, action) => {
  switch (action.type) {
    case Actions.TASKS_SET_OPEN:
      if (action.value) {
        return { ...state, openId: action.id };
      }

      return { ...state, openId: state.openId === action.id ? null : state.openId };
    case Actions.TASKS_SET_SELECTED:
      if (action.value) {
        return { ...state, selectedId: action.id };
      }

      return { ...state, selectedId: state.selectedId === action.id ? null : state.selectedId };
    default:
      return state;
  }
};

export default function (state: TasksState = initialState, action) {
  const entities = entitiesReducer(state.entities, action);
  const ui = uiReducer(state.ui, action);

  return {
    entities,
    ui,
  };
}
