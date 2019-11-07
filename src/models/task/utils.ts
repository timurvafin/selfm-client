/* eslint-disable arrow-body-style */
import chrono from 'chrono-node';
import { Shortcut, WorkspaceTypes } from 'common/constants';
import { filterObjectValues } from '../../common/utils/collection';
import { WorkspaceEntity } from '../workspace';
import { TaskEntity } from './index';


export const extractFieldsValuesFromStr = (str: string) => {
  const parseDateValues = (str) => {
    const parsedDate = chrono.parse(str)[0];

    if (!parsedDate) {
      return {};
    }

    return {
      startTime: parsedDate.start.date().getTime(),
      deadline: parsedDate.end && parsedDate.end.date().getTime(),
    };
  };

  const parseTags = (str) => {
    const matchRes = str.match(/#([\S]+)/g);

    return matchRes ? matchRes.map(tag => tag.substr(1)) : [];
  };

  const values = {
    ...parseDateValues(str),
    tags: parseTags(str),
  };

  return filterObjectValues(values, v => !!v);
};

export const mergeCollectionFieldValues = (fieldValues: Partial<TaskEntity>, entity: TaskEntity) => {
  return {
    ...fieldValues,
    tags: fieldValues.tags ? [...entity.tags, ...fieldValues.tags] : entity.tags,
  };
};

export const getEntityFieldsByWorkspace = (workspace: WorkspaceEntity) => {
  if (!workspace) {
    return {};
  }

  if (workspace.type === WorkspaceTypes.PROJECT) {
    return { parentId: workspace.code };
  }

  if (workspace.type === WorkspaceTypes.SHORTCUT) {
    const handlers = {
      [Shortcut.INBOX]: () => ({ startTime: null, startTimeTag: null, parentId: null, sectionId: null }),
      [Shortcut.TODAY]: () => ({ startTime: Date.now(), startTimeTag: null }),
      [Shortcut.PLANS]: () => ({ startTime: Date.now() + 24 * 3600 * 1000, startTimeTag: null }),
      [Shortcut.ANYTIME]: () => ({ startTimeTag: 'anytime', startTime: null }),
      [Shortcut.SOMEDAY]: () => ({ startTimeTag: 'someday', startTime: null }),
    };

    if (handlers[workspace.code]) {
      return handlers[workspace.code]();
    }
  }

  return {};
};