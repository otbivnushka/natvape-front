import React from 'react';
import clsx from 'clsx';

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, rows=3, 
          placeholder="Необязательно", ...rest }) => {
  return (
    <textarea
      className={clsx(
        'w-full resize-none bg-surface border-2 border-line rounded-xl p-3 text-sm text-body outline-none transition-all duration-200 focus:border-primary placeholder:text-dim',
        className,
      )}
      rows={rows}
      placeholder={placeholder}
      {...rest}
    />
  );
};

export { Textarea };
