import { useState, useCallback, useMemo } from 'react';
import { useProduct } from '../hooks/queries/useProductsQuery';
import { useCart } from '../hooks/queries/useCartQuery';
import type { ProductColor, CartItem } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { Api } from '../api';

export function useProductDetail(id: string) {
  const user = useAuthStore((s) => s.user);
  const productId = Number(id);

  const { data, isLoading: loading } = useProduct(productId, user?.id);
  const { data: cartItems = [] } = useCart();

  const product = data?.product ?? null;
  const initialUserRate = data?.userRate ?? 0;

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [userRating, setUserRating] = useState(initialUserRate);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

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
      /* silent */
    }
  }, [product]);

  const disabledVariantValues = useMemo(() => {
    if (!product?.variants?.length) return [];
    return product.variants
      .filter((v: { value: string; stock: number }) => {
        const ci = cartItems.find(
          (i: CartItem) => i.product.id === product.id && i.variantKey === v.value,
        );
        return v.stock - (ci?.quantity ?? 0) <= 0;
      })
      .map((v: { value: string }) => v.value);
  }, [product, cartItems]);

  const disabledColorNames = useMemo(() => {
    if (!product?.colors?.length) return [];
    return product.colors
      .filter((c: { name: string; stock: number }) => {
        const ci = cartItems.find(
          (i: CartItem) => i.product.id === product.id && i.variantKey === c.name,
        );
        return c.stock - (ci?.quantity ?? 0) <= 0;
      })
      .map((c: { name: string }) => c.name);
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
