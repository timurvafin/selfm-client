import * as Actions from '../actions/projects'
import { fromJS, Map } from 'immutable'
import { map, makeOrderedMap } from '../utils/immutable'

function openProject(projects, id) {
    return map(projects, p => {
        const open = id === p.get('id')

        return {
            selected: open,
            open
        }
    })
}

export default function (projects, tasks, action) {
    switch (action.type) {
        case Actions.PROJECTS_RECEIVE:
            return makeOrderedMap(action.projects, 'id')
        case Actions.PROJECTS_UPDATE:
            return projects.update(action.id, project => project.merge(Map(action.fields)))
        case Actions.PROJECTS_REMOVE:
            return projects.delete(action.id)
        case Actions.PROJECTS_ADD: {
            const project = Map({
                selected: true,
                caption: '',
                open: true,
                completed: false,
                placeholder: 'New project',
            }).merge(fromJS(action.payload))

            return openProject(projects.set(project.get('id'), project), project.get('id'))
        }
        // only ui
        case Actions.PROJECTS_OPEN:
            return openProject(projects, action.id)
        default:
            return projects
    }
}