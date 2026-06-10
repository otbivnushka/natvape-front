import React, { useState } from 'react';
import type { ProductColor } from '@/types';
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
      <div className="flex flex-wrap">
        {visible.map((color) => {
          const isOut = disabledKeys.includes(color.name);
          return (
            <ColorButton
              key={color.name}
              color={color}
              isOut={isOut}
              selectedColor={selectedColor}
              onSelect={onSelect}
            />
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
    <div className="relative w-10 h-10 m-2">
      <button
        onClick={() => {
          if (!isOut) onSelect(color);
        }}
        disabled={isOut}
        className={clsx(
          'w-10 h-10 rounded-full border-2 transition-all duration-150',
          isOut
            ? 'border-line opacity-30 cursor-not-allowed'
            : selectedColor?.name === color.name
              ? 'border-primary cursor-pointer'
              : 'border-line cursor-pointer',
        )}
        title={color.name}
      >
        <div className="w-full h-full rounded-full" style={{ background: color.hex }} />
      </button>
      <CircularText
        text={color.name}
        size={80}
        radius={21}
        className="text-body absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />
    </div>
  );
};

export { ColorPicker };

interface CircularTextProps {
  text: string;
  radius?: number;
  size?: number;
  className?: string;
}

export const CircularText: React.FC<CircularTextProps> = ({
  text,
  radius = 100,
  size = 250,
  className,
}) => {
  const center = size / 2;
  const pathId = `circle-path-1231`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <defs>
        <path
          id={pathId}
          d={`
            M ${center}, ${center}
            m -${radius}, 0
            a ${radius},${radius} 0 1,1 ${radius * 2},0
            a ${radius},${radius} 0 1,1 -${radius * 2},0
          `}
        />
      </defs>

      <text fontSize="7" fill="currentColor">
        <textPath href={`#${pathId}`} startOffset={countOffset(text.length)} fontFamily="monospace">
          {text}
        </textPath>
      </text>
    </svg>
  );
};

const countOffset = (lenght: number): string => {
  const HALF_LENGTH = 17;
  const ONE_LETTER_SPACE = 50 / HALF_LENGTH;
  const offset: string = String(lenght < HALF_LENGTH ? (HALF_LENGTH - lenght) / 2 * ONE_LETTER_SPACE : 0) + "%";
  return offset;
}