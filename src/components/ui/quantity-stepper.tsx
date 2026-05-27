import React from 'react';
import clsx from 'clsx';

interface QuantityStepperProps {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
  size?: 'sm' | 'md';
  max?: number;
}

const btn =
  'border border-line rounded-md bg-surface cursor-pointer flex items-center justify-center text-base text-muted transition-colors duration-150 hover:bg-page';

const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  onDecrement,
  onIncrement,
  size = 'md',
  max,
}) => {
  return (
    <div className="flex items-center gap-2">
      <button className={clsx(btn, size === 'sm' ? 'w-7 h-7' : 'w-8 h-8')} onClick={onDecrement}>
        −
      </button>
      <span
        className={clsx(
          'font-semibold text-primary text-center',
          size === 'sm' ? 'text-sm min-w-5' : 'text-base min-w-8',
        )}
      >
        {quantity}
      </span>
      <button
        className={clsx(
          btn,
          size === 'sm' ? 'w-7 h-7' : 'w-8 h-8',
          max !== undefined && quantity >= max && 'opacity-30 cursor-not-allowed hover:bg-surface',
        )}
        onClick={max !== undefined && quantity >= max ? undefined : onIncrement}
      >
        +
      </button>
    </div>
  );
};

export { QuantityStepper };
