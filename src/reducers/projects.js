import * as Actions from '../actions/projects'
import {List, fromJS, Map} from 'immutable'
import {updateListItemById, map, makeOrderedMap} from '../utils/immutable'

function openProject(projects, id) {
    return map(projects, p => {
        const open = id === p.get('id')

        return {
            selected: open,
            open
        }
    })
}

export default function (projects, action) {
    switch (action.type) {
        case Actions.PROJECTS_RECEIVE:
            return makeOrderedMap(action.projects, 'id')
        case Actions.PROJECTS_UPDATE:
            return projects.update(action.id, project => project.merge(Map(action.fields)))
        /*case Actions.PROJECTS_TOGGLE:
            return updateListItemById(projects, action.id, {completed: action.complete})*/
        case Actions.PROJECTS_ADD:
            const project = Map({
                selected: true,
                open: true,
                placeholder: 'New project',
            }).merge(fromJS(action.payload))

            return projects.set(project.get('id'), project)
        // only ui
        case Actions.PROJECTS_OPEN:
            return openProject(projects, action.id)
        default:
            return projects
    }
}