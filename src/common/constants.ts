import { ArchiveIcon, CalendarIcon, InboxIcon, LayersIcon, StarIcon } from '../components/Icon';
import React from 'react';
import { WorkspaceEntity } from '../models/workspace';
import { ShortcutIcon } from '../views/ShortcutWorkspace/ShortcutIcon';


export const ENTER_KEY = 'Enter';
export const BACKSPACE_KEY = 'Backspace';
export const ESC_KEY = 'Escape';

export enum KeyCode {
  ENTER = 13,
  BACKSPACE = 8,
  ESCAPE = 27,
}

export enum WorkspaceTypes {
  SHORTCUT = 'shortcut',
  PROJECT = 'project',
}

export enum Shortcut {
  INBOX = 'inbox',
  TODAY = 'today',
  PLANS = 'plans',
  ANYTIME = 'anytime',
  SOMEDAY = 'someday',
}

export const SHORTCUT_CAPTIONS = {
  [Shortcut.INBOX]: 'Inbox',
  [Shortcut.TODAY]: 'Today',
  [Shortcut.PLANS]: 'Plans',
  [Shortcut.ANYTIME]: 'Anytime',
  [Shortcut.SOMEDAY]: 'Someday',
};

export enum UIComponentType {
  TASK = 'task',
  PROJECT = 'project',
  TASK_SECTION = 'task-section',
  TASK_GROUP = 'task-group',
  TASK_LIST = 'task-list',
  SIDEBAR_PROJECT = 'sidebar-project',
  SIDEBAR_SHORTCUT = 'sidebar-shortcut',
}

export const SHORTCUT_WORKSPACES: { [code: string]: WorkspaceEntity } = Object.values(Shortcut).reduce((map, code) => {
  map[code] = { type: WorkspaceTypes.SHORTCUT, code };
  return map;
}, {});