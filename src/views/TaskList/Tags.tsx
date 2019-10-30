import React, { useState } from 'react';
import cs from 'classnames';
import { CrossIcon, HashIcon } from '../../components/Icon';

import './tags.scss';
import TextField from '../../components/Textfield';


const TagItem = ({ tag, onRemove, readonly }) => (
  <div className={cs('tag', readonly && 'tag--readonly')}>
    <CrossIcon
      onClick={onRemove}
      className={'tag__cross'}
    />
    <HashIcon className={'tag__hash'} />
    <span className={'tag__caption'}>{tag}</span>
  </div>
);

interface Props {
  tags: Array<string>;
  readonly?: boolean;
  onChange: (tags: Array<string>) => void;
}

const Tags = ({ tags, onChange, readonly }: Props) => {
  const [inputValue, setInputValue] = useState();
  const onRemove = (tag) => {
    onChange(tags.filter(t => t !== tag));
  };

  const onAdd = () => {
    onChange([...tags, inputValue]);
    setInputValue('');
  };

  const tagItems = (tags || []).map((tag) => (
    <TagItem
      key={tag}
      tag={tag}
      readonly={readonly}
      onRemove={() => onRemove(tag)}
    />
  ));

  return (
    <div className="tags">
      {tagItems}
      { !readonly && (
        <TextField
          autosize
          controlled
          transparent
          className="tags__input"
          onEnter={onAdd}
          value={inputValue}
          placeholder={tags.length <= 0 ? 'Add tags' : ''}
          onChange={setInputValue}
        />
      )}
    </div>
  );
};

export default Tags;
