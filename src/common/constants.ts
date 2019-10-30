import { ArchiveIcon, CalendarIcon, InboxIcon, LayersIcon, StarIcon } from '../components/Icon';
import React from 'react';


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

export enum Shortcuts {
  INBOX= 'inbox',
  TODAY= 'today',
  PLANS= 'plans',
  ANYTIME= 'anytime',
  SOMEDAY= 'someday',
}

export const SHORTCUT_CAPTIONS = {
  [Shortcuts.INBOX]: 'Inbox',
  [Shortcuts.TODAY]: 'Today',
  [Shortcuts.PLANS]: 'Plans',
  [Shortcuts.ANYTIME]: 'Anytime',
  [Shortcuts.SOMEDAY]: 'Someday',
};