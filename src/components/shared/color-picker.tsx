import React from 'react';
import type { ProductColor } from '../../types';
import clsx from 'clsx';

interface ColorPickerProps {
  colors: ProductColor[];
  selectedColor: ProductColor | null;
  onSelect: (color: ProductColor) => void;
  disabledKeys?: string[];
}

const ColorPicker: React.FC<ColorPickerProps> = ({ colors, selectedColor, onSelect, disabledKeys = [] }) => {
  return (
    <div className="mb-4">
      <div className="text-sm font-semibold text-muted mb-2">Цвет:</div>
      <div className="flex gap-2">
        {colors.map((c) => {
          const isOut = disabledKeys.includes(c.name);
          return (
            <button
              key={c.name}
              onClick={() => { if (!isOut) onSelect(c); }}
              disabled={isOut}
              className={clsx(
                'relative w-10 h-10 rounded-full border-2 transition-all duration-150',
                isOut
                  ? 'border-line opacity-30 cursor-not-allowed'
                  : selectedColor?.name === c.name
                    ? 'border-primary scale-110 cursor-pointer'
                    : 'border-line cursor-pointer',
              )}
              title={c.name}
            >
              <div className="w-full h-full rounded-full" style={{ background: c.hex }} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { ColorPicker };
