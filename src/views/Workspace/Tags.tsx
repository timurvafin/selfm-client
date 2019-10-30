import React from 'react';
import { Link } from 'react-router-dom';
import cs from 'classnames';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { tagsSelector } from 'store/selectors';
import { isEmpty } from 'common/utils/collection';
import { useSelectedTag } from 'common/hooks';
import { WorkspaceEntity } from '../../store/models/workspace';


const Tag = ({ tag, isSelected }) => (
  <Link
    to={`?tag=${tag}`}
    className={cs('project-tag', isSelected && 'project-tag--selected')}
  >{tag}</Link>
);

const Tags = ({ workspace }: { workspace: WorkspaceEntity }) => {
  // const selectedWorkspace = useSelectedWorkspace();
  const selectedTag = useSelectedTag();
  const tags = useSelector<RootState, Array<string>>(state => tagsSelector(state, workspace));

  const tagItems = tags.map(tag => {
    const isSelected = selectedTag === tag;

    return (
      <Tag
        key={tag}
        tag={tag}
        isSelected={isSelected}
      />
    );
  });

  return !isEmpty(tags) && (
    <div className={'workspace-tags'}>
      <Tag
        tag={'All'}
        isSelected={!selectedTag || selectedTag === 'All'}
      />
      { tagItems }
    </div>
  );
};

export default Tags;