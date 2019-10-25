import { SectionModel } from '../index';
import * as Actions from '../actions/sections';
import { removeById, uniqueById, updateById } from '../../common/utils/collection';
import { ProjectModel } from '../index';


export type SectionsState = {
  entities: Array<SectionModel>;
}

export type ProjectsState = {
  entities: Array<ProjectModel>;
  ui: {
  };
}

const initialState: ProjectsState = {
  entities: [],
  ui: {
  },
};

const entitiesReducer = (sections: Array<ProjectModel>, action) => {
  switch (action.type) {
    case Actions.SECTIONS_RECEIVE:
      return uniqueById([...sections, ...action.sections]);
    case Actions.SECTIONS_UPDATE:
      return updateById(sections, action.id, action.fields);
    case Actions.SECTIONS_REMOVE:
      return removeById(sections, action.id);
    case Actions.SECTIONS_ADD: {
      const section = {
        caption: '',
        ...action.fields,
      };

      return [...sections, section];
    }
    default:
      return sections;
  }
};

const uiReducer = (state, action) => {
  switch (action.type) {
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