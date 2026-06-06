import React, { useState } from 'react';
import type { ProductVariant } from '@/types';
import clsx from 'clsx';

interface VariantPickerProps {
  variants: ProductVariant[];
  variantLabel: string;
  selectedValue: string;
  onSelect: (value: string) => void;
  disabledValues?: string[];
  collapsible?: boolean;
}

const VariantPicker: React.FC<VariantPickerProps> = ({
  variants,
  variantLabel,
  selectedValue,
  onSelect,
  disabledValues = [],
  collapsible = true,
}) => {
  const [showAll, setShowAll] = useState(false);

  const available = variants.filter((v) => !disabledValues.includes(v.value));
  const disabled = variants.filter((v) => disabledValues.includes(v.value));
  const sorted = [...available, ...disabled];
  const hasHidden = collapsible && disabled.length > 0 && !showAll;

  const visible = hasHidden ? available : sorted;

  return (
    <div className="mb-4">
      <div className="text-sm font-semibold text-muted mb-2">{variantLabel}:</div>
      <div className="flex gap-2 flex-wrap">
        {visible.map((v) => {
          const isOut = disabledValues.includes(v.value);
          return (
            <VariantButton key={v.value} v={v} isOut={isOut} selectedValue={selectedValue} onSelect={onSelect} />
          );
        })}
      </div>
      {hasHidden && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-2 text-xs text-muted bg-transparent border border-line rounded-lg px-3 py-1 cursor-pointer hover:text-primary hover:border-primary"
        >
          Ещё {disabled.length}
        </button>
      )}
    </div>
  );
};

interface VariantButtonProps {
  v: ProductVariant;
  isOut: boolean;
  selectedValue: string;
  onSelect: (value: string) => void;
}

const VariantButton: React.FC<VariantButtonProps> = ({ v, isOut, selectedValue, onSelect }) => {
  return (
    <button
      key={v.value}
      onClick={() => {
        if (!isOut) onSelect(v.value);
      }}
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
};

export { VariantPicker };
