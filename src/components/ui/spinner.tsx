import React from 'react';
import { Logo } from './icons/logo';
import clsx from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md';
  className?: string;
}

const sizes = {
  sm: 24,
  md: 48,
};

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  return (
    <div className={clsx('flex items-center justify-center py-12', className)}>
      <Logo height={sizes[size]} width={sizes[size]} className="animate-spin" />
    </div>
  );
};

export { Spinner };
