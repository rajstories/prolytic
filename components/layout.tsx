import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen font-sans text-brand-navy ${className}`.trim()}>
      {children}
    </div>
  );
};
