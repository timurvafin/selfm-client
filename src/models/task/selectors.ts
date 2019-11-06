import { Map } from 'immutable';
import { createSelector } from 'reselect';
import { Shortcut, WorkspaceTypes } from '../../common/constants';
import { ID } from '../../common/types';
import { EntitiesMap } from '../common';
import { ModelsState } from '../index';
import { TaskEntity } from './index';
import { WorkspaceEntity } from '../workspace';


const shortcutTaskPredicates = {
  [Shortcut.INBOX]: (task: TaskEntity) => !task.startTime && !task.startTimeTag && !task.parentId && !task.completed,
  [Shortcut.TODAY]: (task: TaskEntity) => {
    // TODO:impl change logic
    if (!task.startTime) {
      return false;
    }

    return Date.now() - task.startTime < 3600 * 24 * 1000;
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
  }
);

export const siblings = createSelector(
  byWorkspace,
  (s, w, sectionId?: ID) => sectionId,
  (entities: EntitiesMap<TaskEntity>, sectionId) => entities.filter(entity => entity.sectionId == sectionId)
);