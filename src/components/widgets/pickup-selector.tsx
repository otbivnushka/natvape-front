import { Api } from '@/api';
import type { Address } from '@/types';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

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
  const [pickupPoints, setPickupPoints] = useState<Address[]>([]);

  useEffect(() => {
    Api.addresses
      .getAllPickups()
      .then((res) => setPickupPoints(res))
      .catch(() => {});
  }, []);

  return (
    <div className={className}>
      <h2 className="text-sm font-semibold text-muted mb-2.5">Точка самовывоза</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {pickupPoints.map((p) => (
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
