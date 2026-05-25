import React from 'react';
import clsx from 'clsx';

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...rest }) => {
  return (
    <input
      className={clsx('py-2 px-2.5 border border-line rounded-lg text-[13px] text-body bg-surface outline-none transition-[border-color] duration-200 focus:border-primary', className)}
      {...rest}
    />
  );
};

export { Input };
