import React, { HTMLProps, useCallback } from 'react';


// @ts-ignore
interface Props extends HTMLProps<HTMLInputElement> {
  value: boolean;
  onChange: (value: boolean) => void;
}

const Checkbox = ({ onChange, className, value, ...props }: Props) => {
  const handleChange = useCallback(
    (e) => onChange(e.target.checked),
    [onChange],
  );

  return (
    <input
      {...props}
      checked={value}
      type="checkbox"
      onChange={handleChange}
      className={className}
    />
  );
};

export default Checkbox;