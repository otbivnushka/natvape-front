import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import clsx from 'clsx';

interface Option<T extends string = string> {
  value: T;
  label: string;
}

interface CustomDropdownProps<T extends string> {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
}

const CustomDropdown = <T extends string>({
  value,
  options,
  onChange,
  placeholder,
  className,
}: CustomDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={clsx('relative inline-flex', className)}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={clsx(
          'flex items-center gap-1 border-2 rounded-xl bg-surface text-[13px] outline-none transition-all duration-200 cursor-pointer whitespace-nowrap',
          'py-1.5 pr-1.5 pl-3',
          isOpen ? 'border-primary' : 'border-line hover:border-muted',
          selected ? 'text-body' : 'text-dim',
        )}
      >
        <span>{selected ? selected.label : (placeholder ?? '')}</span>
        <ChevronDown
          size={14}
          className={clsx('shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-full w-max bg-surface border-2 border-line rounded-xl shadow-lg overflow-hidden animate-[scaleIn_0.12s_ease]">
          {options.length === 0 ? (
            <div className="px-3 py-3 text-[12px] text-dim text-center">Нет вариантов</div>
          ) : (
            options.map((opt, i) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={clsx(
                    'flex items-center gap-1.5 w-full px-3 py-1.5 text-left text-[13px] transition-colors duration-100 cursor-pointer border-none',
                    i === 0 && 'rounded-t-xl',
                    i === options.length - 1 && 'rounded-b-xl',
                    isSelected
                      ? 'text-body font-medium'
                      : 'text-muted hover:bg-page hover:text-body',
                  )}
                >
                  <span className="w-3.5 shrink-0 flex items-center justify-center">
                    {isSelected && <Check size={12} />}
                  </span>
                  <span>{opt.label}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export { CustomDropdown };
