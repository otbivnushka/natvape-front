import clsx from 'clsx';
import React from 'react';
import type { Product } from '../../types';
import { EmptyState } from './empty-state';
import { SearchX } from 'lucide-react';
import { ProductCard } from './product-card';
import { ProductSkeleton } from './product-skeleton';
import { Skeleton } from '../ui';

interface ProductsContainerProps {
  products: Product[];
  loading: boolean;
  className?: string;
}

const ProductsContainer: React.FC<ProductsContainerProps> = ({ products, loading, className }) => {
  return (
    <div className={clsx(className)}>
      {!loading && products.length > 0 ? (
        <div className="text-[12px] text-dim mb-3">
          Найдено: {products.length}{' '}
          {products.length === 1 ? 'товар' : products.length < 5 ? 'товара' : 'товаров'}
        </div>
      ) : (
        <Skeleton className="h-4.5 w-30 mb-3" />
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          <ProductSkeleton count={6} />
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={<SearchX size={48} />}
          title="Ничего не найдено"
          description="Попробуйте изменить фильтры или поисковый запрос"
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export { ProductsContainer };
