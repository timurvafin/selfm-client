import React, { HTMLProps, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import cs from 'classnames';
import TextArea from 'react-textarea-autosize';
import { KeyCode } from 'common/constants';
import { isFocused, isFunction } from '../../common/utils/common';

import styles from './textfield.scss';


type SetRef = (node: HTMLElement) => void;

// @ts-ignore
export interface Props extends HTMLProps<HTMLInputElement> {
  value?: string;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  onChange: (value: string) => void;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>, node: HTMLInputElement) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
  controlled?: boolean;
  transparent?: boolean;
  autosize?: boolean;
  inputRef?: SetRef | MutableRefObject<any>;
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
  inputRef: outerRef,
  ...props
}: Props) => {
  const innerRef = useRef<HTMLInputElement>();
  const setRef = useCallback((node) => {
    innerRef.current = node;

    if (isFunction(outerRef)) {
      (outerRef as SetRef)(node);
    } else if (typeof outerRef === 'object') {
      (outerRef as MutableRefObject<any>).current = node;
    }
  }, []);

  useEffect(() => {
    if (autoFocus) {
      if (!isFocused(innerRef.current)) {
        innerRef.current.focus();
        // place caret at the input end
        innerRef.current.selectionStart = innerRef.current.selectionEnd = innerRef.current.value.length;
      }
    }
  }, [autoFocus]);

  const [inputValue, setInputValue] = useState(value);
  const width = autosize ? (value || placeholder || '').length + 'ch' : undefined;
  const [style, setStyle] = useState({ width });

  useEffect(
    () => {
      setInputValue(value);
    },
    [value]
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
        setStyle({ width: 1 + (val || placeholder || '').length + 'ch' });
      }
    },
    []
  );

  const cancel = useCallback(
    () => {
      if (inputValue !== value) {
        setInputValue(value);
      }
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
          setTimeout(() => innerRef.current.blur());
          props.onCancel && props.onCancel();
          break;
        case KeyCode.ENTER:
          onEnter && onEnter(e, innerRef.current);
          // submit();
          break;
      }

      if (props.onKeyDown) {
        props.onKeyDown(e);
      }
    },
    [cancel, onEnter, props.onKeyDown, props.onCancel]
  );

  const cls = cs(styles.textfield, className, {
    [styles.textfieldMultiline]: multiline,
    [styles.textfieldTransparent]: transparent,
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
      inputRef={setRef}
    />
  ) : (
    <input
      {...commonProps}
      ref={setRef}
      type="text"
    />
  );
};

export default TextField;