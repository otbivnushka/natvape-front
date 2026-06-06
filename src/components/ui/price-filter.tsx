import React from 'react';

interface PriceFilterProps {
  min: number;
  max: number;
  onMinChange: (val: number) => void;
  onMaxChange: (val: number) => void;
  globalMin?: number;
  globalMax?: number;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  min,
  max,
  onMinChange,
  onMaxChange,
  globalMin = 0,
  globalMax = 120,
}) => {
  const pct = (v: number) => {
    const range = globalMax - globalMin;
    if (range <= 0) return 0;
    return ((v - globalMin) / range) * 100;
  };

  return (
    <>
      <style>{`
        .rf-track::-webkit-slider-runnable-track { -webkit-appearance: none; background: transparent; pointer-events: none; height: 8px; }
        .rf-track::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--color-primary, #000); border: 3px solid var(--color-surface, #fff); cursor: pointer; pointer-events: auto; transition: transform 0.15s; margin-top: -5px; }
        .rf-track::-moz-range-track { background: transparent; pointer-events: none; height: 8px; }
        .rf-track::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: var(--color-primary, #000); border: 3px solid var(--color-surface, #fff); cursor: pointer; pointer-events: auto; margin-top: -5px; }
      `}</style>

      <div className="flex items-center gap-2">
        <span className="text-[12px] text-muted whitespace-nowrap">Цена:</span>

        <div className="relative w-32.5 h-5 flex items-center">
          <div className="absolute inset-x-0 h-2 bg-line rounded-full" />

          <div
            className="absolute h-2 bg-primary rounded-full"
            style={{ left: `${pct(min)}%`, width: `${pct(max) - pct(min)}%` }}
          />

          <input
            type="range"
            min={globalMin}
            max={globalMax}
            value={min}
            onChange={(e) => onMinChange(Math.min(Number(e.target.value), max - 1))}
            className="rf-track absolute inset-x-0 w-full h-full appearance-none bg-transparent pointer-events-none z-3 m-0 p-0"
          />

          <input
            type="range"
            min={globalMin}
            max={globalMax}
            value={max}
            onChange={(e) => onMaxChange(Math.max(Number(e.target.value), min + 1))}
            className="rf-track absolute inset-x-0 w-full h-full appearance-none bg-transparent pointer-events-none z-4 m-0 p-0"
          />
        </div>

        <span className="text-[12px] text-muted tabular-nums whitespace-nowrap">
          {min}–{max}
        </span>
      </div>
    </>
  );
};

export { PriceFilter };
