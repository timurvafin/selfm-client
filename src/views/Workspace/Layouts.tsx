import React, { ReactNode } from 'react';
import cn from 'classnames';
import * as styles from './workspace.scss';


interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Container = ({ children, className }: LayoutProps) => <div className={cn(styles.workspace, className)}>{children}</div>;

export const Row = ({ children, className }: LayoutProps) => {
  if (!children) {
    return null;
  }

  return (
    <div className={cn(styles.row, className)}>
      {children}
    </div>
  );
};

export const CaptionRow = ({ children, className }: LayoutProps) => <Row className={cn(styles.rowCaption, className)}>{children}</Row>;
export const Caption = ({ children, className }: LayoutProps) => <div className={cn(styles.caption, className)}>{children}</div>;
export const BodyRow = ({ children, className }: LayoutProps) => <Row className={cn(styles.rowBody, className)}>{children}</Row>;
export const EmptyBody = ({ children, className }: LayoutProps) => <Row className={cn(styles.emptyContent, className)}>{children}</Row>;
