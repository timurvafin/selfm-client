import * as Actions from 'src/actions/projects'
import {updateById, randomString, merge, updateItems} from 'src/utils/common'

function openProject(projects, id) {
    return updateItems(projects, p => {
        const open = id === p.id;
        return {
            selected: open,
            open
        }
    });
}

export default function (projects = [], action = null) {
    switch (action.type) {
        case Actions.RECEIVE_PROJECTS:
            return action.projects;
        case Actions.UPDATE_PROJECT:
            return updateById(projects, action.id, action.fields);
        case Actions.CREATE_PROJECT:
            return [
                ...updateItems(projects, p => {return {selected: false, open: false}}),
                {tempId: randomString(), selected: true, open: true, placeholder: 'Новый проект', caption: ''}
            ];
        // view
        case Actions.OPEN_PROJECT:
            return openProject(projects, action.id);
        default:
            return projects
    }
}