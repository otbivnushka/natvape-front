import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  LiquidIcon,
  EvaporatorIcon,
  CartridgeIcon,
  SnusIcon,
  PodIcon,
  DisposableIcon,
} from '../components/ui/icons';
import { PageLayout } from '../components/shared';
import { Skeleton } from '../components/ui';
import { CatalogCard } from '../components/shared';
import { useApiData } from '../hooks/useApiData';
import { Api } from '../api';

const SIZE_ICON = 120;

const categoryIcons: Record<string, ReactNode> = {
  liquids: <LiquidIcon width={SIZE_ICON} height={SIZE_ICON} />,
  coils: <EvaporatorIcon width={SIZE_ICON} height={SIZE_ICON} />,
  cartridges: <CartridgeIcon width={SIZE_ICON} height={SIZE_ICON} />,
  snus: <SnusIcon width={SIZE_ICON} height={SIZE_ICON} />,
  pods: <PodIcon width={SIZE_ICON} height={SIZE_ICON} />,
  disposables: <DisposableIcon width={SIZE_ICON} height={SIZE_ICON} />,
};

const Catalog = () => {
  const navigate = useNavigate();
  const { data: cats, loading } = useApiData(() => Api.categories.getAll(), []);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-primary mb-5">Каталог</h1>

      {loading ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton count={6} />
        </div>
      ) : (
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
    </PageLayout>
  );
};

export default Catalog;
