import { DNDId } from '../types';


export const encodeDraggableId = (id: string, type: string): string => JSON.stringify({ id, type });
export const decodeDroppableId = (idStr: string): DNDId => {
  try {
    const json = JSON.parse(idStr);
    return json;
  } catch (e) {
    return null;
  }
};