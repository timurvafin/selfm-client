import { DropResult } from 'react-beautiful-dnd';
import { decodeDroppableId } from './utils';
import { DropHandler } from './types';


export default (dropHandlersRegistry: Map<string, DropHandler>) => (result: DropResult) => {
  const { destination, source } = result;

  // drop nowere
  if (!destination) {
    return;
  }

  // position wasn't changed
  if (source.droppableId === destination.droppableId && destination.index === source.index) {
    return;
  }

  const draggableSource = decodeDroppableId(result.draggableId);

  const sourceItem = {
    droppableId: source.droppableId,
    id: draggableSource.id,
    type: draggableSource.type,
    index: source.index,
  };

  const destinationItem = {
    droppableId: destination.droppableId,
    index: destination.index,
  };

  const dropHandler = dropHandlersRegistry.get(destination.droppableId);

  if (dropHandler) {
    dropHandler(sourceItem, destinationItem);
  }
};