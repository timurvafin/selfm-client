import React from 'react';
import { ArchiveIcon, CalendarIcon, InboxIcon, LayersIcon, StarIcon } from '../Icon';
import { Shortcut } from '../../common/constants';

import './style.scss';


const COMPONENTS = {
  [Shortcut.INBOX]: InboxIcon,
  [Shortcut.TODAY]: StarIcon,
  [Shortcut.PLANS]: CalendarIcon,
  [Shortcut.ANYTIME]: LayersIcon,
  [Shortcut.SOMEDAY]: ArchiveIcon,
};

interface Props {
  code: string;
  size?: string;
  color?: string;
  className?: string;
}

export const ShortcutIcon = ({ code, className, size, color }: Props) => {
  const Icon = COMPONENTS[code];
  const style = {
    fontSize: size,
    color,
  };

  return (
    <Icon
      style={style}
      className={`shortcut-icon shortcut-icon--${code} ${className}`}
    />
  );
};