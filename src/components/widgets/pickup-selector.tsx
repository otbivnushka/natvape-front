import React from 'react';
import type { Address } from '@/types';
import { usePickups } from '@/hooks/queries/usePickupsQuery';
import clsx from 'clsx';

interface PickupSelectorProps {
  pickupPoint: number | null;
  setPickupPoint: (point: number) => void;
  className?: string;
}

const PickupSelector: React.FC<PickupSelectorProps> = ({
  pickupPoint,
  setPickupPoint,
  className,
}) => {
  const { data: pickupPoints = [] } = usePickups();

  return (
    <div className={className}>
      <h2 className="text-sm font-semibold text-muted mb-2.5">Точка самовывоза</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {pickupPoints.map((p: Address) => (
          <button
            key={p.id}
            onClick={() => setPickupPoint(p.id)}
            className={clsx(
              'py-4 px-3.5 rounded-lg text-[13px] font-medium cursor-pointer',
              pickupPoint === p.id
                ? 'bg-primary text-on-primary'
                : 'bg-surface text-body hover:border-muted',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export { PickupSelector };
