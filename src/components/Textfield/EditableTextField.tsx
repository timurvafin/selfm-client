import React, { useCallback, useState } from 'react';
import TextField, { Props as TextFieldProps } from './TextField';


interface Props extends TextFieldProps {
  edit?: boolean;
  textFieldClass?: string;
  captionClass?: string;
}

const EditableTextField = ({ edit, textFieldClass, captionClass, value, className, ...props }: Props) => {
  const [editState, setEditState] = useState(edit || false);
  const onMouseDown = useCallback(
    (e) => {
      setEditState(true);
      props.onMouseDown && props.onMouseDown(e);
    },
    []
  );
  const onBlur = useCallback(
    (e) => {
      setEditState(false);
      props.onBlur && props.onBlur(e);
    },
    []
  );

  return editState ? (
    <TextField
      {...props}
      autoFocus
      className={textFieldClass || className}
      value={value}
      onBlur={onBlur}
    />
  ) : (
    <div
      className={captionClass || className}
      onMouseDown={onMouseDown}>
      {value}
    </div>
  );
};

export default EditableTextField;