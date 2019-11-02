import { WorkspaceEntity } from 'models/workspace';


export function randomString() {
  return Math.random().toString(36).slice(2);
}

export function merge(...objects) {
  return Object.assign({}, ...objects);
}

export const isWorkspacesEqual = (w1: WorkspaceEntity, w2: WorkspaceEntity) => {
  if (w1 == w2) {
    return true;
  }

  if (!w1 || !w2) {
    return false;
  }

  return w1.type === w2.type && w1.code === w2.code;
};

export const workspaceId = (workspace: WorkspaceEntity) => {
  if (!workspace) {
    return null;
  }

  return `${workspace.type}-${workspace.code}`;
}

export const isUndefined = arg => arg === undefined;
