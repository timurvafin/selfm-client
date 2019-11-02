import React from 'react';
import cs from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { ModelsState } from 'store';
import { tagsSelector } from 'store/selectors';
import { isEmpty } from 'common/utils/collection';
import { workspaceActions, WorkspaceEntity, workspaceSelectors } from 'models/workspace';

import './tags.scss';


const Tag = ({ tag, isSelected, onSelect }) => (
  <div
    onClick={onSelect}
    className={cs('workspace-tag', isSelected && 'workspace-tag--selected')}
  >{tag}</div>
);

const Tags = ({ workspace }: { workspace: WorkspaceEntity }) => {
  const tags = useSelector<ModelsState, Array<string>>(state => tagsSelector(state, workspace));
  const selectedTag = useSelector<ModelsState, string | null>(workspaceSelectors.selectedTag);

  const dispatch = useDispatch();
  const selectTag = (tag) => dispatch(workspaceActions.selectTag(tag));

  const tagItems = tags.map(tag => {
    const isSelected = selectedTag === tag;

    return (
      <Tag
        key={tag}
        tag={tag}
        onSelect={() => selectTag(tag)}
        isSelected={isSelected}
      />
    );
  });

  return !isEmpty(tags) && (
    <div className={'workspace-tags'}>
      <Tag
        tag={'All'}
        onSelect={() => selectTag(null)}
        isSelected={!selectedTag}
      />
      { tagItems }
    </div>
  );
};

export default Tags;