import React, { HTMLProps } from 'react';
import cs from 'classnames';
import {
  FiPlus,
  FiAlignJustify,
  FiX,
  FiCheck,
  FiMoreHorizontal,
  FiList,
  FiTag,
  FiCalendar,
  FiTrash,
  FiHash,
} from 'react-icons/fi';

import './icon.scss';


const asIcon = (FiIcon): React.FC<HTMLProps<HTMLElement>> => ({ className, ...props }: { className?: string }) => (
  <FiIcon
    className={cs('icon', className)}
    {...props}
  />
);

// @link https://react-icons.netlify.com/#/icons/fi
export const PlusIcon = asIcon(FiPlus);
export const CheckIcon = asIcon(FiCheck);
export const CrossIcon = asIcon(FiX);
export const MoveIcon = asIcon(FiAlignJustify);
export const MoreIcon = asIcon(FiMoreHorizontal);
export const ListIcon = asIcon(FiList);
export const TagIcon = asIcon(FiTag);
export const CalendarIcon = asIcon(FiCalendar);
export const TrashIcon = asIcon(FiTrash);
export const HashIcon = asIcon(FiHash);
