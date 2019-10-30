/* eslint-disable arrow-body-style */
import {
  createActionCreators,
  ModelSpec,
} from './common';
import { RootState } from './index';


export interface WorkspaceEntity { id: any; type: 'project' | 'shortcut' }

export type WorkspaceState = {
  selectedWorkspace?: WorkspaceEntity;
  selectedTag?: string;
}

export const namespace = 'workspace';

const actions = createActionCreators({
  selectWorkspace: (type: 'project' | 'shortcut', id: any) => ({ workspace: { type, id } }),
  selectTag: (tag: string) => ({ tag }),
}, namespace);

const selectors = {
  selectedTag: (state: RootState) => state[namespace].selectedTag,
  selectedWorkspace: (state: RootState) => state[namespace].selectedWorkspace,
};

const spec: ModelSpec<WorkspaceState, typeof actions> = {
  namespace,
  state: {
    selectedWorkspace: null,
    selectedTag: null,
  },
  actions,
  reducers: {
    selectWorkspace: (state: WorkspaceState, { workspace: { id, type } }) => {
      return { ...state, selectedWorkspace: { id, type } };
    },
    selectTag: (state: WorkspaceState, { tag }) => {
      return { ...state, selectedTag: tag };
    },
  },
};

export { actions as workspaceActions, selectors as workspaceSelectors };

export default spec;



