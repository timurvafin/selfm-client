import React from 'react';
import { useSelector } from 'react-redux';
import { State } from 'store';
import { projectOpenIdSelector } from 'store/selectors';

import Project from '../Project';
import { ID } from '../../common/types';


const WorkSpace = () => {
  const id = useSelector<State, ID>(projectOpenIdSelector);

  return (
    <div className="workspace">
      {id && <Project id={id} />}
    </div>
  );
};

export default WorkSpace;

