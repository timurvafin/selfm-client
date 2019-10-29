import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { projectOpenIdSelector } from 'store/selectors';

import Project from '../Project';
import { ID } from '../../common/types';


const WorkSpace = () => {
  const id = useSelector<RootState, ID>(projectOpenIdSelector);

  return (
    <div className="workspace">
      {id && <Project id={id} />}
    </div>
  );
};

export default WorkSpace;

