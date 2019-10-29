import React from 'react';
import cs from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { actions as ProjectActions } from 'store/models/project';
import { projectSelectedTagSelector, projectTagsSelector } from '../../store/selectors';
import { isEmpty } from '../../common/utils/collection';


const ProjectTag = ({ tag, onSelect, isSelected }) => (
  <div
    className={cs('project-tag', isSelected && 'project-tag--selected')}
    onClick={onSelect}
  >{tag}</div>
  );

const ProjectTags = ({ projectId }) => {
  const tags = useSelector<RootState, Array<string>>(state => projectTagsSelector(state, projectId));
  const selectedTag = useSelector<RootState, string | null>(projectSelectedTagSelector);

  const dispatch = useDispatch();
  const selectTag = (tag) => dispatch(ProjectActions.selectTag(tag));

  const tagItems = tags.map(tag => {
    const isSelected = selectedTag === tag;

    return (
      <ProjectTag
        key={tag}
        tag={tag}
        isSelected={isSelected}
        onSelect={() => selectTag(tag)}
      />
    );
  });

  return !isEmpty(tags) && (
    <div className={'project-tags'}>
      <ProjectTag
        tag={'All'}
        isSelected={!selectedTag}
        onSelect={() => selectTag(null)}
      />
      { tagItems }
    </div>
  );
};

export default ProjectTags;