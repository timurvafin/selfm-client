import * as Actions from '../actions/projects';
import { removeById, uniqueById, updateById } from '../../common/utils/collection';
import { ProjectModel } from '../index';
import { ID } from '../../common/types';


export type ProjectsState = {
  entities: Array<ProjectModel>;
  ui: {
    openId?: ID;
    selectedTag?: string;
  };
}

const initialState: ProjectsState = {
  entities: [],
  ui: {
    openId: null,
  },
};

const entitiesReducer = (projects: Array<ProjectModel>, action) => {
  switch (action.type) {
    case Actions.PROJECTS_RECEIVE:
      return uniqueById([...projects, ...action.projects]);
    case Actions.PROJECTS_UPDATE:
      return updateById(projects, action.id, action.fields);
    case Actions.PROJECTS_REMOVE:
      return removeById(projects, action.id);
    case Actions.PROJECTS_ADD: {
      const project = {
        caption: '',
        completed: false,
        placeholder: 'New project',
        ...action.fields,
      };

      return [...projects, project];
    }
    default:
      return projects;
  }
};

const uiReducer = (state, action) => {
  switch (action.type) {
    case Actions.PROJECTS_OPEN:
    case Actions.PROJECTS_ADD: {
      return { ...state, openId: action.id, selectedTag: null };
    }
    case Actions.PROJECTS_SELECT_TAG: {
      return { ...state, selectedTag: action.tag };
    }
    default:
      return state;
  }
};

export default function (state = initialState, action) {
  const entities = entitiesReducer(state.entities, action);
  const ui = uiReducer(state.ui, action);

  return {
    entities,
    ui,
  };
}