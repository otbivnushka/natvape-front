import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Api } from '../api';
import type { Product, ProductColor } from '../types';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { ArrowLeft, HelpCircle, Loader2 } from 'lucide-react';
import { StarRating, PriceDisplay } from '../components/ui';
import {
  PageLayout,
  FixedButton,
  ColorPicker,
  VariantPicker,
  DetailsSkeleton,
} from '../components/shared';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { AddProductWidget } from '../components/shared/add-product-widget';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  useScrollToTop();

  useEffect(() => {
    if (!id) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    Api.products
      .getById(Number(id), user?.id)
      .then((api) => {
        const p = Api.products.mapProduct(api);
        Api.productCache.setOne(p);
        setProduct(p);
        if (api.userRate) setUserRating(api.userRate);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id, user?.id]);

  const handleRate = useCallback(
    async (value: number) => {
      if (!user || !product || ratingSubmitting) return;
      setRatingSubmitting(true);
      setUserRating(value);
      try {
        await Api.rates.upsert(user.id, product.id, value);
      } catch {
        setUserRating(product.userRate ?? 0);
      } finally {
        setRatingSubmitting(false);
      }
    },
    [user, product, ratingSubmitting],
  );

  if (loading) {
    return (
      <PageLayout>
        <DetailsSkeleton />
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-3">
          <HelpCircle size={48} className="text-muted opacity-50" />
          <div className="text-base font-semibold text-muted">Товар не найден</div>
          <div className="text-sm text-muted max-w-70">Попробуйте вернуться в каталог</div>
          <button
            onClick={() => navigate('/')}
            className="mt-4 py-2.5 px-6 border-none rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer hover:opacity-80"
          >
            В каталог
          </button>
        </div>
      </PageLayout>
    );
  }

  const hasVariants = product.variants && product.variants.length > 0;
  const hasColors = product.colors && product.colors.length > 0;

  const cartItems = useCartStore.getState().items;
  const disabledVariantValues = hasVariants
    ? product
        .variants!.filter((v) => {
          const ci = cartItems.find((i) => i.product.id === product.id && i.variantKey === v.value);
          return v.stock - (ci?.quantity ?? 0) <= 0;
        })
        .map((v) => v.value)
    : [];
  const disabledColorNames = hasColors
    ? product
        .colors!.filter((c) => {
          const ci = cartItems.find((i) => i.product.id === product.id && i.variantKey === c.name);
          return c.stock - (ci?.quantity ?? 0) <= 0;
        })
        .map((c) => c.name)
    : [];

  return (
    <PageLayout>
      <FixedButton
        onClick={() => navigate(-1)}
        className="top-4 left-4 z-10 gap-1.5 py-2 pl-3 pr-4 rounded-full bg-surface/80 backdrop-blur-md border border-line text-sm text-body hover:-translate-x-0.5"
      >
        <ArrowLeft size={16} />
        Назад
      </FixedButton>

      <div className="max-w-5xl pt-12 md:pt-0 mx-auto md:grid md:grid-cols-2 md:gap-10 md:items-start">
        <div className="flex justify-center mb-4 md:mb-0 md:sticky md:top-24">
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-xl max-w-87.5 aspect-square object-cover"
          />
        </div>

        <div>
          <div className="flex items-start justify-between mb-1">
            <h1 className="text-xl font-bold text-primary">{product.name}</h1>
          </div>

          <div className="mb-3">
            <PriceDisplay price={product.price} doublePrice={product.doublePrice} size="lg" />
          </div>

          <div className="flex items-center gap-1 mb-4">
            <StarRating rating={product.rating} />
          </div>

          {hasVariants && (
            <VariantPicker
              variants={product.variants!}
              variantLabel={product.variantLabel!}
              selectedValue={selectedVariant}
              onSelect={(obj) => {
                setSelectedVariant(obj);
              }}
              disabledValues={disabledVariantValues}
            />
          )}

          {hasColors && (
            <ColorPicker
              colors={product.colors!}
              selectedColor={selectedColor}
              onSelect={(obj) => {
                setSelectedColor(obj);
              }}
              disabledKeys={disabledColorNames}
            />
          )}

          <div className="mb-4">
            <div className="text-sm font-semibold text-muted mb-2">Описание:</div>
            <p className="text-sm text-muted leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-4">
            <div className="text-sm font-semibold text-muted mb-2">Ваша оценка:</div>
            <div className="flex items-center gap-2 h-8">
              <StarRating
                rating={userRating}
                showValue={false}
                interactive={!!user}
                onChange={handleRate}
              />
              {ratingSubmitting && <Loader2 size={14} className="animate-spin text-muted" />}
              {userRating > 0 && !ratingSubmitting && (
                <span className="text-xs text-muted">{userRating}</span>
              )}
              {userRating > 0 && (
                <button
                  className="text-xs px-2 py-1 text-muted border rounded-full bg-transparent"
                  onClick={() => handleRate(0)}
                >
                  Убрать
                </button>
              )}
            </div>
          </div>

          <AddProductWidget product={product} selected={selectedColor?.name || selectedVariant} />
        </div>
      </div>
    </PageLayout>
  );
};

export default ProductDetail;
