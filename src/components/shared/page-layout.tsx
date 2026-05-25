import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="px-4 pt-4 pb-20 md:px-6 md:pt-6 md:pb-24 lg:pb-16">{children}</div>
  );
};

export { PageLayout };
