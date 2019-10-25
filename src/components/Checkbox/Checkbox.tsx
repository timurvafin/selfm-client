import React, { HTMLProps, useCallback } from 'react';
import cs from 'classnames';

import './checkbox.scss';


// @ts-ignore
interface Props extends HTMLProps<HTMLInputElement> {
  round?: boolean;
  value: boolean;
  onChange: (value: boolean) => void;
}

const Checkbox = ({ onChange, round, className, value, ...props }: Props) => {
  const handleChange = useCallback(
    (e) => onChange(e.target.checked),
    [onChange],
  );

  const cls = cs('checkbox', className, {
    'checkbox--round': round,
  });

  return (
    <input
      {...props}
      checked={value}
      type="checkbox"
      onChange={handleChange}
      className={cls}
    />
  );
};

export default Checkbox;