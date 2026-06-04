import React, { useState } from 'react';
import type { ProductColor } from '../../types';
import clsx from 'clsx';

interface ColorPickerProps {
  colors: ProductColor[];
  selectedColor: ProductColor | null;
  onSelect: (color: ProductColor) => void;
  disabledKeys?: string[];
  collapsible?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColor,
  onSelect,
  disabledKeys = [],
  collapsible = true,
}) => {
  const [showAll, setShowAll] = useState(false);

  const available = colors.filter((c) => !disabledKeys.includes(c.name));
  const disabled = colors.filter((c) => disabledKeys.includes(c.name));
  const hasHidden = collapsible && disabled.length > 0 && !showAll;
  const visible = hasHidden ? available : colors;

  return (
    <div className="mb-4">
      <div className="text-sm font-semibold text-muted mb-2">Цвет:</div>
      <div className="flex gap-2 flex-wrap">
        {visible.map((color) => {
          const isOut = disabledKeys.includes(color.name);
          return (
            <ColorButton key={color.name} color={color} isOut={isOut} selectedColor={selectedColor} onSelect={onSelect} />
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

interface ColorButtonProps {
  color: ProductColor;
  isOut: boolean;
  selectedColor: ProductColor | null;
  onSelect: (color: ProductColor) => void;
}

const ColorButton: React.FC<ColorButtonProps> = ({ color, isOut, selectedColor, onSelect }) => {
  return (
    <button
      key={color.name}
      onClick={() => {
        if (!isOut) onSelect(color);
      }}
      disabled={isOut}
      className={clsx(
        'relative w-10 h-10 rounded-full border-2 transition-all duration-150',
        isOut
          ? 'border-line opacity-30 cursor-not-allowed'
          : selectedColor?.name === color.name
            ? 'border-primary scale-110 cursor-pointer'
            : 'border-line cursor-pointer',
      )}
      title={color.name}
    >
      <div className="w-full h-full rounded-full" style={{ background: color.hex }} />
    </button>
  );
};

export { ColorPicker };
