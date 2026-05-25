import React from 'react';
import type { ProductVariant } from '../../types';
import clsx from 'clsx';

interface VariantPickerProps {
  variants: ProductVariant[];
  variantLabel: string;
  selectedValue: string;
  onSelect: (value: string) => void;
  disabledValues?: string[];
}

const VariantPicker: React.FC<VariantPickerProps> = ({ variants, variantLabel, selectedValue, onSelect, disabledValues = [] }) => {
  return (
    <div className="mb-4">
      <div className="text-sm font-semibold text-muted mb-2">{variantLabel}:</div>
      <div className="flex gap-2 flex-wrap">
        {variants.map((v) => {
          const isOut = disabledValues.includes(v.value);
          return (
            <button
              key={v.value}
              onClick={() => { if (!isOut) onSelect(v.value); }}
              disabled={isOut}
              className={clsx(
                'py-1.5 px-3.5 rounded-lg border text-[13px] font-medium transition-all duration-150',
                isOut
                  ? 'border-line text-dim opacity-40 cursor-not-allowed line-through'
                  : selectedValue === v.value
                    ? 'bg-primary text-on-primary border-primary cursor-pointer'
                    : 'bg-surface text-body border-line cursor-pointer hover:border-primary hover:text-primary',
              )}
            >
              {v.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { VariantPicker };
