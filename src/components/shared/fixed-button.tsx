import React from 'react';
import clsx from 'clsx';

interface FixedButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const FixedButton: React.FC<FixedButtonProps> = ({ onClick, children, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'fixed z-40 flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 rounded-full bg-surface/80 backdrop-blur-md text-sm text-body',
        className,
      )}
    >
      {children}
    </button>
  );
};

export { FixedButton };
