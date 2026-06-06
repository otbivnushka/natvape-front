import clsx from 'clsx';
import React, { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ApiCategoryInfo } from '../../api/dto/category.dto';
import {
  CartridgeIcon,
  DisposableIcon,
  EvaporatorIcon,
  LiquidIcon,
  PodIcon,
  SnusIcon,
} from '../ui/icons';
import { CatalogCard } from './catalog-card';

const SIZE_ICON = 120;

const categoryIcons: Record<string, ReactNode> = {
  liquids: <LiquidIcon width={SIZE_ICON} height={SIZE_ICON} />,
  coils: <EvaporatorIcon width={SIZE_ICON} height={SIZE_ICON} />,
  cartridges: <CartridgeIcon width={SIZE_ICON} height={SIZE_ICON} />,
  snus: <SnusIcon width={SIZE_ICON} height={SIZE_ICON} />,
  pods: <PodIcon width={SIZE_ICON} height={SIZE_ICON} />,
  disposables: <DisposableIcon width={SIZE_ICON} height={SIZE_ICON} />,
};

interface CatalogContainerProps {
  loading?: boolean;
  cats?: ApiCategoryInfo[] | null;
  className?: string;
}

const CatalogContainer: React.FC<CatalogContainerProps> = ({ cats, className }) => {
  const navigate = useNavigate();

  return (
    <div className={clsx(className)}>
      {cats && (
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
          {(cats ?? []).map((cat, i) => (
            <CatalogCard
              key={cat.key}
              cat={cat}
              icon={categoryIcons[cat.key]}
              index={i}
              onClick={() => navigate(`/category/${cat.key}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { CatalogContainer };
