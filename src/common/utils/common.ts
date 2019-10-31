import { DNDId } from '../types';
import { WorkspaceEntity } from '../../store/models/workspace';


export function randomString() {
  return Math.random().toString(36).slice(2);
}

export function merge(...objects) {
  return Object.assign({}, ...objects);
}

export const encodeDroppableId = (scope: string, code: string, type?: string): string => JSON.stringify({
  scope,
  code,
  type,
});
export const encodeDraggableId = (code: string, type: string): string => JSON.stringify({ code, type });
export const decodeDNDId = (idStr: string): DNDId => {
  try {
    const json = JSON.parse(idStr);
    return json;
  } catch (e) {
    return null;
  }
};

export const isWorkspacesEqual = (w1: WorkspaceEntity, w2: WorkspaceEntity) => {
  if (w1 == w2) {
    return true;
  }

  if (!w1 || !w2) {
    return false;
  }

  return w1.type === w2.type && w1.code === w2.code;
};

export const isUndefined = arg => arg === undefined;
