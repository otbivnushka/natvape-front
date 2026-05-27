import React from 'react';
import clsx from 'clsx';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const baseInput =
  'border-2 border-line rounded-xl bg-surface text-[13px] text-body outline-none transition-all duration-200 focus:border-primary placeholder:text-dim';

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, className }) => {
  return (
    <input
      className={clsx(
        'w-full py-1.5 pr-2.5 pl-7 bg-size-[14px] bg-position-[left_8px_center] bg-no-repeat',
        baseInput,
        className,
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='%239ca3af' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242.656a5 5 0 1 1 0-10 5 5 0 0 1 0 10z'/%3E%3C/svg%3E")`,
      }}
      type="text"
      placeholder="Поиск..."
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
    />
  );
};

export { SearchBar };
