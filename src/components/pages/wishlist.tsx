import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/queries/useWishlistQuery';
import {
  ProductCard,
  EmptyState,
  PageLayout,
  PageTitle,
  ProductSkeleton,
} from '@/components/shared';

const Wishlist = () => {
  const { data: products, isLoading } = useWishlist();

  return (
    <PageLayout>
      <PageTitle>Избранное</PageTitle>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          <ProductSkeleton count={4} />
        </div>
      ) : !products?.length ? (
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
