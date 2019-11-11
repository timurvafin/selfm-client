/* eslint-disable react/jsx-max-props-per-line */
import React from 'react';
import { useSelector } from 'react-redux';
import { SHORTCUT_CAPTIONS, SHORTCUT_WORKSPACES } from 'common/constants';
import { isEmpty } from 'common/utils/collection';
import { ModelsState } from 'models';
import { tasksSelector, TaskUIEntity } from 'store/selectors';
import { ShortcutIcon } from './ShortcutIcon';
import { Layouts as Workspace, Tags as WorkspaceTags } from '../Workspace';
import styles from './style.scss';


const EmptyShortcutContent = ({ code }) => (
  <Workspace.EmptyBody>
    <ShortcutIcon
      code={code}
      size={'70px'}
      color={'#eee'}
    />
  </Workspace.EmptyBody>
);

const ShortcutWorkspaceLayout = ({ code, children }) => {
  const caption = SHORTCUT_CAPTIONS[code];
  const workspace = SHORTCUT_WORKSPACES[code];
  const tasks = useSelector<ModelsState, Array<TaskUIEntity>>(state => tasksSelector(state, workspace));

  return (
    <Workspace.Container className={styles.shortcut}>
      <Workspace.CaptionRow>
        <ShortcutIcon code={code} className={styles['icon']} />
        <Workspace.Caption>{caption}</Workspace.Caption>
      </Workspace.CaptionRow>
      <Workspace.Row>
        <WorkspaceTags workspace={workspace} />
      </Workspace.Row>
      <Workspace.BodyRow className={styles.body}>
        { isEmpty(tasks) && <EmptyShortcutContent code={code} /> }
        { children({ tasks }) }
      </Workspace.BodyRow>
    </Workspace.Container>
  );
};

export default ShortcutWorkspaceLayout;
