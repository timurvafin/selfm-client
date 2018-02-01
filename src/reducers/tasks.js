import * as Actions from 'src/actions/tasks'
import {updateById, merge, randomString, updateItems} from 'src/utils/common'
import _ from 'lodash/fp'

export default function (tasks = {}, action = null) {
    switch (action.type) {
        case Actions.RECEIVE_TASKS:
            return merge(tasks, _.keyBy('id')(action.tasks));
        case Actions.ADD_TASK:
            return merge(tasks, merge({id: randomString()}, action.fields));
        case Actions.UPDATE_TASK:
            const newTasks = _.assign(tasks)({})
            const newTask  = merge(newTasks[action.id], action.fields)

            return merge(newTasks, {[action.id]: newTask});
        case Actions.REMOVE_TASK:
            return tasks.filter(task => task.id !== action.id);
        case Actions.TOGGLE_TASK:
            return updateById(tasks, action.id, task => {return {completed: !task.completed}});
        case Actions.REORDER_TASKS:
            return tasks;

        case Actions.CREATE_TODO:
            const todo = {caption: '', tempId: randomString(), completed: false};

            return _.update(action.parentId)(task => {
                return merge(task, {
                    todos: [
                        ...task.todos,
                        todo
                    ]
                });
            })(tasks);
        // view
        case Actions.SELECT_TASK:
            return _.mapValues(task => {
                return merge(task, {
                    selected: action.id === task.id && action.select,
                    open: action.id === task.id && !action.select ? false : task.open
                })
            })(tasks);
        case Actions.OPEN_TASK:
            return _.mapValues(task => {
                return merge(task, {
                    open: action.id === task.id,
                })
            })(tasks);
        case Actions.SET_EDITABLE:
            return updateById(tasks, action.id, {editable: action.editable});
        default:
            return tasks
    }
}