import React from 'react';
import { Store, Truck } from 'lucide-react';
import clsx from 'clsx';

const deliveryOptions = [
  { value: 'pickup', label: 'Самовывоз', icon: Store },
  { value: 'delivery', label: 'Доставка (не халява)', icon: Truck },
] as const;

const radioBase =
  'flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200';

interface DeliveryMethodSelectorProps {
  value: 'pickup' | 'delivery';
  onChange: (value: 'pickup' | 'delivery') => void;
}

const DeliveryMethodSelector: React.FC<DeliveryMethodSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="mb-5">
      <h2 className="text-sm font-semibold text-muted mb-2.5">Способ получения</h2>
      <div className="flex flex-col gap-2">
        {deliveryOptions.map((opt) => {
          const selected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={clsx(
                radioBase,
                selected
                  ? 'border-primary bg-primary/5'
                  : 'border-line bg-surface hover:border-muted',
              )}
            >
              <input
                type="radio"
                name="delivery"
                value={opt.value}
                checked={selected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <span
                className={clsx(
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-200',
                  selected ? 'border-primary' : 'border-muted',
                )}
              >
                {selected && <span className="w-2 h-2 rounded-full bg-primary" />}
              </span>
              <opt.icon size={18} className={selected ? 'text-primary' : 'text-dim'} />
              <span
                className={clsx('text-sm font-medium', selected ? 'text-body' : 'text-muted')}
              >
                {opt.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export { DeliveryMethodSelector };
