import React from 'react';
import clsx from 'clsx';
import { formatPrice } from '../../utils/formatPrice';

interface PriceDisplayProps {
  price: number;
  oldPrice?: number;
  size?: 'sm' | 'lg';
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ price, oldPrice, size = 'sm' }) => {
  return (
    <div className="flex items-baseline gap-2">
      <span className={clsx('font-bold text-primary', size === 'lg' ? 'text-xl' : 'text-base')}>
        {formatPrice(price)}
      </span>
      {oldPrice && (
        <span className={clsx('text-muted line-through', size === 'lg' ? 'text-sm' : 'text-[13px]')}>
          {formatPrice(oldPrice)}
        </span>
      )}
    </div>
  );
};

export { PriceDisplay };
