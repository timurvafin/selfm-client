import React from 'react';
import { ArchiveIcon, CalendarIcon, InboxIcon, LayersIcon, StarIcon } from 'components/Icon';
import { Shortcut } from 'common/constants';
import cs from 'classnames';
import styles from './style.scss';


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
      className={cs(styles.icon, styles[code], className)}
    />
  );
};