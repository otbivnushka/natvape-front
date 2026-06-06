import React from 'react';
import clsx from 'clsx';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  selected?: boolean;
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  size = 'md',
  disabled,
  selected,
  className,
}) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={clsx(
        'border-none font-semibold transition-all duration-200',
        disabled
          ? 'bg-muted text-on-primary opacity-40 cursor-not-allowed'
          : 'bg-primary text-on-primary cursor-pointer hover:opacity-95',
        size === 'sm' ? 'w-full py-2 rounded-lg text-[13px]' : 'w-full py-3 rounded-xl text-[15px]',
        className,
        selected ? 'bg-primary! text-page!' : '',
      )}
    >
      {children}
    </button>
  );
};

export { PrimaryButton };
