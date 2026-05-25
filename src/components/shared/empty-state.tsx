import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-3">
      <div className="text-5xl opacity-50 text-secondary">{icon}</div>
      <div className="text-base font-semibold text-secondary">{title}</div>
      {description && <div className="text-sm text-dim max-w-70">{description}</div>}
    </div>
  );
};

export { EmptyState };
