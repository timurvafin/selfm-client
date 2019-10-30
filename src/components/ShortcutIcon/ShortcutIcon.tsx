import React from 'react';
import { ArchiveIcon, CalendarIcon, InboxIcon, LayersIcon, StarIcon } from '../Icon';
import { Shortcuts } from '../../common/constants';

import './style.scss';


const COMPONENTS = {
  [Shortcuts.INBOX]: InboxIcon,
  [Shortcuts.TODAY]: StarIcon,
  [Shortcuts.PLANS]: CalendarIcon,
  [Shortcuts.ANYTIME]: LayersIcon,
  [Shortcuts.SOMEDAY]: ArchiveIcon,
};

export const ShortcutIcon = ({ id, className }: { id: string; className?: string }) => {
  const Icon = COMPONENTS[id];

  return <Icon className={`shortcut-icon shortcut-icon--${id} ${className}`} />;
};