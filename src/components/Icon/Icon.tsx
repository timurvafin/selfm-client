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
  FiTrash2,
  FiHash,
  FiArrowRight,
  FiCopy,
} from 'react-icons/fi';
import {
  FaInbox,
  FaStar,
  FaRegCalendarAlt,
  FaArchive,
  FaLayerGroup,
} from 'react-icons/fa';

import styles from './icon.scss';


const asIcon = (ConcreteIcon): React.FC<HTMLProps<HTMLElement>> => {
  const Icon = ({ className, ...props }: { className?: string }) => (
    <ConcreteIcon
      className={cs(styles.icon, className)}
      {...props}
    />
  );

  return React.memo(Icon);
};

// @link https://react-icons.netlify.com/#/icons/fi
export const PlusIcon = asIcon(FiPlus);
export const CheckIcon = asIcon(FiCheck);
export const CrossIcon = asIcon(FiX);
export const MoveIcon = asIcon(FiAlignJustify);
export const MoreIcon = asIcon(FiMoreHorizontal);
export const ListIcon = asIcon(FiList);
export const TagIcon = asIcon(FiTag);
export const CalendarIcon = asIcon(FaRegCalendarAlt);
export const TrashIcon = asIcon(FiTrash2);
export const HashIcon = asIcon(FiHash);
export const ArrowRightIcon = asIcon(FiArrowRight);
export const CopyIcon = asIcon(FiCopy);
// filled
export const InboxIcon = asIcon(FaInbox);
export const StarIcon = asIcon(FaStar);
export const ArchiveIcon = asIcon(FaArchive);
export const LayersIcon = asIcon(FaLayerGroup);
