import React, { useRef } from 'react';
import cs from 'classnames';
import animateValue from 'common/animation/animateValue';
import { delay } from 'common/utils/common';
import styles from './todolist.scss';


const animateCheckmark = async (pathNode: HTMLElement) => {
  pathNode.style.stroke = '#cd3d82';
  pathNode.style.strokeDasharray = '100%';
  const cb = (dashOffset) => {
    pathNode.style.strokeDashoffset = `${dashOffset}%`;
  };

  const firstPhase = async () => new Promise(resolve => {
    animateValue(100, 73, 150, 'linear', cb, resolve);
  });

  const secondPhase = async () => new Promise(resolve => {
    animateValue(73, 0, 250, [0.19, 1, 0.22, 1], cb, resolve);
  });

  await firstPhase();
  await delay(200);
  await secondPhase();
  await delay(200);
  pathNode.removeAttribute('style');
};

const TodoCheckbox = ({ value, onChange, accent }) => {
  const cls = cs(styles.checkbox, {
    [styles.checked]: value,
    [styles.accent]: accent,
  });

  const pathRef = useRef(null);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={'0, 0, 100, 100'}
      className={cls}
      onClick={(e) => {
        e.stopPropagation();

        if (!value) {
          animateCheckmark(pathRef.current);
        }

        onChange(!value);
      }}
    >

      <path
        ref={pathRef}
        className={styles.checkmark}
        d={'M 35 45 L 45 65 L 70 30'}
      />
      <circle className={styles.circle} />
    </svg>
  );
};

export default TodoCheckbox;