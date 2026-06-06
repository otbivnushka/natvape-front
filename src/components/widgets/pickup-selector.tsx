import React from 'react';

const pickupPoints = [
  'McDonalds',
  'Трио',
  'Зеленая гура',
  'Континент',
  'Марко',
  'Правды 60а (Евроопт)',
];

interface PickupSelectorProps {
  pickupPoint: string;
  setPickupPoint: (point: string) => void;
  className?: string;
}

const PickupSelector: React.FC<PickupSelectorProps> = ({
  pickupPoint,
  setPickupPoint,
  className,
}) => {
  return (
    <div className={className}>
      <h2 className="text-sm font-semibold text-muted mb-2.5">Точка самовывоза</h2>
      <div className="flex flex-wrap gap-2">
        {pickupPoints.map((p) => (
          <button
            key={p}
            onClick={() => setPickupPoint(p)}
            className={
              pickupPoint === p
                ? 'py-1.5 px-3.5 rounded-lg border border-primary bg-primary text-on-primary text-[13px] font-medium cursor-pointer'
                : 'py-1.5 px-3.5 rounded-lg border border-line bg-surface text-body text-[13px] font-medium cursor-pointer hover:border-muted'
            }
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};

export { PickupSelector };
