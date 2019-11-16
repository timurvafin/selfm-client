import { UIComponentType } from 'common/constants';
import React from 'react';
import { DragPreviewProps } from 'vendor/dnd/react-dnd';
import { SortableElement } from 'vendor/dnd/react-dnd/sortable';
import Task, { Props } from './Task';
import * as styles from './task.scss';
import { PointerEventsProperty, PositionProperty } from 'csstype';


const getPreviewStyle = ({
  componentSize,
  startMousePosition,
  startComponentPosition,
  dropTarget,
}: DragPreviewProps) => {
  const delta = [startMousePosition.x - startComponentPosition.x, startMousePosition.y - startComponentPosition.y];
  const transformOrigin = [100 * delta[0] / componentSize.width, 100 * delta[1] / componentSize.height];

  return {
    transformOrigin: `${transformOrigin[0]}% ${transformOrigin[1]}% 0`,
    transition: 'transform .2s',
    transform: dropTarget && dropTarget.type === UIComponentType.SIDEBAR_SHORTCUT ? ' scale(.2, .5)' : '',
    // static
    position: ('absolute' as PositionProperty),
    width: '100%',
    height: '100%',
    pointerEvents: ('none' as PointerEventsProperty),
    backgroundColor: '#1d67fd',
    opacity: '.5',
  };
};

const DragPreview = (props: DragPreviewProps) => {
  const style = getPreviewStyle(props);

  return (
    <div style={props.wrapperStyle}>
      <div
        style={style}
        className={styles['drag-preview']}
      />
    </div>
  );
};

const SortableTask = (props: Props) => (
  <SortableElement
    id={props.task.id}
    type={UIComponentType.TASK}
    canDrag={!props.task.isOpen}
    previewComponent={DragPreview}
  >
    {({
      setRef,
      style,
    }) => (
      <div
        ref={setRef}
        style={style}
        className={styles.taskOuter}
      >
        <Task {...props} />
      </div>
    )}
  </SortableElement>
);

export default SortableTask;