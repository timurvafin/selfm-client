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

interface Props {
 id: string;
 size?: string;
 color?: string;
 className?: string;
}

export const ShortcutIcon = ({ id, className, size, color }: Props) => {
  const Icon = COMPONENTS[id];
  const style = {
    fontSize: size,
    color,
  };

  return (
    <Icon
      style={style}
      className={`shortcut-icon shortcut-icon--${id} ${className}`}
    />
);
};