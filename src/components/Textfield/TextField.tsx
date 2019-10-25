import React, { HTMLProps, useCallback, useEffect, useRef, useState } from 'react';
import cs from 'classnames';
import TextArea from 'react-textarea-autosize';
import { KeyCode } from 'common/constants';

import './textfield.scss';


// @ts-ignore
export interface Props extends HTMLProps<HTMLInputElement> {
  value?: string;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  autoFocus?: boolean;
  controlled?: boolean;
  transparent?: boolean;
  autosize?: boolean;
}

const TextField = ({
  value,
  multiline,
  className,
  autoFocus,
  onChange,
  onEnter,
  controlled,
  transparent,
  autosize,
  placeholder,
  ...props
}: Props) => {
  const ref = useRef<HTMLInputElement>();
  useEffect(() => {
    if (autoFocus) {
      ref.current.focus();
    }
  }, [autoFocus]);

  const [inputValue, setInputValue] = useState(value);
  const width = autosize ? (value || placeholder || '').length + 'ch' : undefined;
  const [style, setStyle] = useState({ width });

  useEffect(
    () => {

    },
    [value, inputValue]
  );

  const onType = useCallback(
    (e) => {
      const val = e.target.value;

      if (!controlled) {
        setInputValue(val);
      } else {
        onChange(val);
      }

      if (autosize) {
        setStyle({ width: (val || placeholder || '').length + 'ch' });
      }
    },
    []
  );

  const cancel = useCallback(
    () => {
      if (inputValue !== value) {
        setInputValue(value);
      }
      setTimeout(() => ref.current.blur());
    },
    [value, inputValue]
  );

  const onBlur = useCallback(
    (e) => {
      if (!controlled && inputValue !== value) {
        onChange(inputValue);
      }

      if (props.onBlur) {
        props.onBlur(e);
      }
    },
    [inputValue, value]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.keyCode) {
        case KeyCode.ESCAPE:
          if (!controlled) {
            cancel();
          }
          break;
        case KeyCode.ENTER:
          onEnter && onEnter();
          // submit();
          break;
      }

      if (props.onKeyDown) {
        props.onKeyDown(e);
      }
    },
    [cancel, onEnter, props.onKeyDown]
  );

  const cls = cs('textfield', className, {
    'textfield--multiline': multiline,
    'textfield--transparent': transparent,
  });

  const commonProps = {
    ...props,
    placeholder,
    style,
    className: cls,
    onChange: onType,
    value: (controlled ? value : inputValue) || '',
    onKeyDown,
    onBlur: onBlur,
    spellCheck: false,
  };

  return multiline ? (
    <TextArea
      {...commonProps}
      inputRef={ref}
    />
  ) : (
    <input
      {...commonProps}
      ref={ref}
      type="text"
    />
  );
};

export default TextField;