import React from 'react';
import clsx from 'clsx';
import { formatPrice } from '../../utils/formatPrice';

interface PriceDisplayProps {
  price: number;
  doublePrice?: number | null;
  size?: 'sm' | 'lg';
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ price, doublePrice, size = 'sm' }) => {
  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={clsx('font-bold text-primary', size === 'lg' ? 'text-xl' : 'text-base')}>
        {formatPrice(price)}
      </span>
      {doublePrice != null && (
        <span className="text-[11px] font-semibold text-accent bg-accent/10 px-1.5 py-0.5 rounded">
          1+1 = {formatPrice(doublePrice)}
        </span>
      )}
    </div>
  );
};

export { PriceDisplay };
