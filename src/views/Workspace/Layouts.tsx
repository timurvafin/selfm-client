import React, { ReactNode } from 'react';
import cn from 'classnames';


interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Container = ({ children, className }: LayoutProps) => <div className={cn('workspace', className)}>{children}</div>;

export const Row = ({ children, className }: LayoutProps) => {
  if (!children) {
    return null;
  }

  return (
    <div className={cn('workspace__row', className)}>
      {children}
    </div>
  );
};

export const CaptionRow = ({ children, className }: LayoutProps) => <Row className={cn('workspace__row--caption', className)}>{children}</Row>;
export const BodyRow = ({ children, className }: LayoutProps) => <Row className={cn('workspace__row--body', className)}>{children}</Row>;
