import React, { ReactNode, useCallback } from 'react';
import cs from 'classnames';

import './action.scss';


interface Props {
  icon?: ReactNode;
  action: () => void;
  name?: string;
  title?: string;
  className?: string;
  iconClassName?: string;
  hoverClr?: string;
}

export default function Action({ className, action, icon, name }: Props) {
  const onClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      action();
    },
    [action],
  );

  return (
    <div
      className={cs('action', className)}
      onMouseDown={onClick}
    >
      {icon || null}
      {name && <span className="action__name">{name}</span>}
    </div>
  );
}