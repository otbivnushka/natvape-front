import { useState, useEffect, useCallback, useMemo } from 'react';
import { Api } from '../api';
import type { Product, ProductColor } from '../types';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export function useProductDetail(id: string) {
  const user = useAuthStore((s) => s.user);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  useEffect(() => {
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

  const handleShare = useCallback(async () => {
    try {
      const shareUrl = encodeURIComponent(`${window.location.href}`);

      const text = encodeURIComponent(`${product?.name || 'NV'}`);

      window.Telegram.WebApp.openTelegramLink(
        `https://t.me/share/url?url=${shareUrl}&text=${text}`,
      );
    } catch {
      // user cancelled or API not supported
    }
  }, [product]);

  const cartItems = useCartStore.getState().items;

  const disabledVariantValues = useMemo(() => {
    if (!product?.variants?.length) return [];
    return product.variants
      .filter((v) => {
        const ci = cartItems.find((i) => i.product.id === product.id && i.variantKey === v.value);
        return v.stock - (ci?.quantity ?? 0) <= 0;
      })
      .map((v) => v.value);
  }, [product, cartItems]);

  const disabledColorNames = useMemo(() => {
    if (!product?.colors?.length) return [];
    return product.colors
      .filter((c) => {
        const ci = cartItems.find((i) => i.product.id === product.id && i.variantKey === c.name);
        return c.stock - (ci?.quantity ?? 0) <= 0;
      })
      .map((c) => c.name);
  }, [product, cartItems]);

  return {
    product,
    loading,
    userRating,
    ratingSubmitting,
    selectedColor,
    setSelectedColor,
    selectedVariant,
    setSelectedVariant,
    disabledColorNames,
    disabledVariantValues,
    handleRate,
    handleShare,
    user,
  };
}
