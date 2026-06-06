import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Api } from '@/api';
import type { Product } from '@/types';
import {
  ProductCard,
  EmptyState,
  PageLayout,
  PageTitle,
  ProductSkeleton,
} from '@/components/shared';

const Wishlist = () => {
  const productIds = useWishlistStore((s) => s.productIds);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productIds.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Api.products
      .getAll({ limit: 999 })
      .then((res) => {
        const all = res.items.map(Api.products.mapProduct);
        Api.productCache.set(all);
        setProducts(all.filter((p) => productIds.includes(p.id)));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [productIds]);

  return (
    <PageLayout>
      <PageTitle>Избранное</PageTitle>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          <ProductSkeleton count={4} />
        </div>
      ) : products.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={<Heart size={48} />}
            title="Список пуст"
            description="Нажмите ❤ на карточке товара, чтобы добавить в избранное"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export { Wishlist };
