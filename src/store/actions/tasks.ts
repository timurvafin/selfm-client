export const TASKS_LOAD = 'tasks/load';
export const TASKS_MOVE = 'tasks/move';
export const TASKS_RECEIVE = 'tasks/receive';
export const TASKS_CREATE = 'tasks/create';
export const TASKS_ADD = 'tasks/add';
export const TASKS_UPDATE = 'tasks/update';
export const TASKS_ADD_TODO = 'tasks/add-todo';
export const TASKS_CREATE_TODO = 'tasks/create-todo';
export const TASKS_REMOVE_TODO = 'tasks/remove-todo';
export const TASKS_UPDATE_TODO = 'tasks/update-todo';
export const TASKS_TOGGLE = 'tasks/toggle';
export const TASKS_REMOVE = 'tasks/remove';
export const TASKS_REORDER = 'tasks/reorder';
export const TASKS_SET_SELECTED = 'tasks/select';
export const TASKS_SET_OPEN = 'tasks/open';

export function load(parentId) {
  return {
    type: TASKS_LOAD,
    parentId,
  };
}

export function create(parentId, sectionId) {
  return {
    type: TASKS_CREATE,
    parentId,
    sectionId,
  };
}

export function update(id, values) {
  return {
    type: TASKS_UPDATE,
    id,
    values,
  };
}

export const addTodo = (taskId, fields) => ({ type: TASKS_ADD_TODO, taskId, fields });
export const createTodo = (taskId) => ({ type: TASKS_CREATE_TODO, taskId });
export const updateTodo = (taskId, todoId, fields) => ({ type: TASKS_UPDATE_TODO, taskId, todoId, fields });
export const removeTodo = (taskId, todoId) => ({ type: TASKS_REMOVE_TODO, taskId, todoId });

export function toggle(id, complete) {
  return {
    type: TASKS_TOGGLE,
    id,
    complete,
  };
}

export function remove(id) {
  return {
    type: TASKS_REMOVE,
    id,
  };
}

export function add(fields) {
  return {
    type: TASKS_ADD,
    fields,
  };
}

export function move(id, parentId) {
  return {
    type: TASKS_MOVE,
    id,
    parentId,
  };
}

export function receive(tasks) {
  return {
    type: TASKS_RECEIVE,
    tasks,
  };
}

export function reorder(ids) {
  return {
    type: TASKS_REORDER,
    ids,
  };
}

export function setSelected(id, value = true) {
  return {
    type: TASKS_SET_SELECTED,
    id,
    value,
  };
}

export function setOpen(id, value = true) {
  return {
    type: TASKS_SET_OPEN,
    id,
    value,
  };
}