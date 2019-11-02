import { ID } from '../../common/types';
import { BaseEntity, BaseTaskEntity, EntitiesMap } from '../common';
import modelSpec, { actions, namespace } from './modelSpec';
import * as selectors from './selectors';


export interface TodoEntity extends BaseEntity {
  id: ID;
  caption: string;
  completed: boolean;
}

export interface TaskEntity extends BaseTaskEntity {
  todoList: Array<TodoEntity>;
  tags: Array<string>;
}

export interface TodoEntity {
  id: ID;
  caption: string;
  completed: boolean;
}

export interface TasksUIState {
  openId?: ID;
  selectedId?: ID;
}

export type TasksState = {
  entities: EntitiesMap<TaskEntity>;
  ui: TasksUIState;
}

export {
  namespace as tasksNamespace,
  actions as taskActions,
  selectors as taskSelectors,
};

export default modelSpec;