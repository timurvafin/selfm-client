import React, { ReactNode } from 'react';


interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Container = ({ children, className }: LayoutProps) => <div className={`workspace ${className}`}>{children}</div>;
export const Row = ({ children, className }: LayoutProps) => <div className={`workspace-row ${className}`}>{children}</div>;
export const CaptionRow = ({ children, className }: LayoutProps) => <div className={`workspace-row workspace-row--caption ${className}`}>{children}</div>;
export const BodyRow = ({ children, className }: LayoutProps) => <div className={`workspace-row workspace-row--body ${className}`}>{children}</div>;
