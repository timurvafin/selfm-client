import React from 'react';
import { UIComponentType } from 'common/constants';
import { SortableElement } from 'vendor/dnd/react-dnd/sortable';
import { DraggableContentProps } from 'vendor/dnd/react-dnd';
import Task, { Props } from './Task';


const getPreviewStyle = ({ componentRect, startMousePosition, startComponentPosition, dropTarget }: Partial<DraggableContentProps>) => {
  const delta = [startMousePosition.x - startComponentPosition.x, startMousePosition.y - startComponentPosition.y];
  const transformOrigin = [100 * delta[0] / componentRect.width, 100 * delta[1] / componentRect.height];

  return {
    transformOrigin: `${transformOrigin[0]}% ${transformOrigin[1]}% 0`,
    transition: 'transform .2s',
    transform: dropTarget && dropTarget.type === UIComponentType.SIDEBAR_SHORTCUT ? ' scale(.2, .5)' : '',
  };
};

const DragPreview = (props: Partial<DraggableContentProps>) => {
  const style = getPreviewStyle(props);

  return (
    <div
      style={style}
      className="drag-preview"
    />
  );
};

const DraggableTask = (props: Props) => (
  <SortableElement
    index={props.index}
    id={props.task.id}
    type={UIComponentType.TASK}
    canDrag={!props.task.isOpen}
  >
    {({
      setRef,
      style,
      isDragging,
      ...rest
    }) => (
      isDragging ? (
        <DragPreview {...rest} />
      ) : (
        <div
          ref={setRef}
          style={style}
          className={'task-outer'}
        >
          <Task {...props} />
        </div>
      )
    )}
  </SortableElement>
);

export default DraggableTask;