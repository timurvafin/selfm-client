import { Map } from 'immutable';
import moment from 'moment';
import { createSelector } from 'reselect';
import { Shortcut, WorkspaceTypes } from '../../common/constants';
import { ID } from '../../common/types';
import { isUndefined } from '../../common/utils/common';
import { EntitiesMap } from '../common';
import { ModelsState } from '../index';
import { WorkspaceEntity } from '../workspace';
import { TaskEntity } from './index';


const shortcutTaskPredicates = {
  [Shortcut.INBOX]: (task: TaskEntity) => !task.startTime && !task.startTimeTag && !task.parentId && !task.completed,
  [Shortcut.TODAY]: (task: TaskEntity) => {
    const todayStart = moment().startOf('day').valueOf();
    const todayEnd = moment().endOf('day').valueOf();

    const startTime = task.startTime;

    // if it's future task
    if (!startTime || startTime > todayEnd) {
      return false;
    }

    if (startTime > todayStart) {
      return true;
    }

    return !task.completed;
  },
  [Shortcut.PLANS]: (task: TaskEntity) => !!task.startTime,
  [Shortcut.ANYTIME]: (task: TaskEntity) => task.startTimeTag === 'anytime',
  [Shortcut.SOMEDAY]: (task: TaskEntity) => task.startTimeTag === 'someday',
};

export const byId = (state: ModelsState, id: ID) => state.tasks.entities.get(id);

export const byWorkspace = createSelector(
  (state: ModelsState) => state.tasks.entities,
  (_, workspace: WorkspaceEntity) => workspace,
  (entities: EntitiesMap<TaskEntity>, workspace) => {
    if (!workspace) {
      return Map<ID, TaskEntity>();
    }

    return entities.filter(entity => {
      if (workspace.type === WorkspaceTypes.PROJECT) {
        return entity.parentId === workspace.code;
      }

      if (workspace.type === WorkspaceTypes.SHORTCUT) {
        return shortcutTaskPredicates[workspace.code](entity);
      }

      return false;
    });
  },
);

export const siblings = createSelector(
  byWorkspace,
  (state, workspace, parentId?: ID) => parentId,
  (state, workspace, parentId?: ID, sectionId?: ID) => sectionId,
  (entities: EntitiesMap<TaskEntity>, parentId, sectionId) => entities.filter(entity => {
    const parentMatched = isUndefined(parentId) || entity.parentId == parentId;
    const sectionMatched = isUndefined(sectionId) || entity.sectionId == sectionId;

    return parentMatched || sectionMatched;
  }),
);