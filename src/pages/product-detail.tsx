import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Api } from '../api';
import type { Product, ProductColor } from '../types';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { formatPrice } from '../utils/formatPrice';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import {
  StarRating,
  QuantityStepper,
  PriceDisplay,
  PrimaryButton,
  Skeleton,
} from '../components/ui';
import { PageLayout, FixedButton, ColorPicker, VariantPicker } from '../components/shared';
import clsx from 'clsx';

const StarInput = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        onClick={() => onChange(star)}
        className={clsx(
          'text-2xl leading-none bg-none border-none cursor-pointer transition-colors duration-150',
          star <= value ? 'text-primary' : 'text-muted',
        )}
      >
        ★
      </button>
    ))}
  </div>
);

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCartStore((s) => s);
  const addToast = useToastStore((s) => s.addToast);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    if (!id) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    Api.products
      .getById(Number(id))
      .then((api) => {
        const p = Api.products.mapProduct(api);
        Api.productCache.setOne(p);
        setProduct(p);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-5xl mx-auto">
          <Skeleton count={4} />
        </div>
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
  const canAdd = hasVariants ? selectedVariant !== '' : hasColors ? selectedColor !== null : true;

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

  const variantStock = hasVariants
    ? (() => {
        const v = product.variants!.find((v) => v.value === selectedVariant);
        if (!v) return 0;
        const ci = cartItems.find((i) => i.product.id === product.id && i.variantKey === v.value);
        return v.stock - (ci?.quantity ?? 0);
      })()
    : hasColors
      ? (() => {
          if (!selectedColor) return 0;
          const ci = cartItems.find(
            (i) => i.product.id === product.id && i.variantKey === selectedColor.name,
          );
          return selectedColor.stock - (ci?.quantity ?? 0);
        })()
      : 0;

  const maxQuantity = canAdd ? variantStock : 0;
  const increment = () => setQuantity((q) => Math.min(q + 1, maxQuantity));
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    const variantKey = selectedVariant || selectedColor?.name || undefined;
    if (!variantKey && !canAdd) return;
    addToCart(product.id, variantKey, quantity);
    const label = selectedVariant
      ? product.variants?.find((v) => v.value === selectedVariant)?.name
      : selectedColor?.name;
    addToast(`${product.name}${label ? ` — ${label}` : ''} добавлен в корзину (${quantity} шт.)`);
  };

  return (
    <PageLayout>
      <FixedButton
        onClick={() => navigate(-1)}
        className="top-4 left-4 z-10 gap-1.5 py-2 pl-3 pr-4 rounded-full bg-surface/80 backdrop-blur-md border border-line text-sm text-body hover:-translate-x-0.5"
      >
        <ArrowLeft size={16} />
        Назад
      </FixedButton>

      <div className="max-w-5xl mx-auto md:grid md:grid-cols-2 md:gap-10 md:items-start">
        <div className="flex justify-center mb-4 md:mb-0 md:sticky md:top-24">
          <div className="w-full rounded-xl max-w-[350px] aspect-square bg-primary" />
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
            <span className="text-xs text-muted">({product.rating})</span>
          </div>

          {hasVariants && (
            <VariantPicker
              variants={product.variants!}
              variantLabel={product.variantLabel!}
              selectedValue={selectedVariant}
              onSelect={setSelectedVariant}
              disabledValues={disabledVariantValues}
            />
          )}

          {hasColors && (
            <ColorPicker
              colors={product.colors!}
              selectedColor={selectedColor}
              onSelect={setSelectedColor}
              disabledKeys={disabledColorNames}
            />
          )}

          <div className="mb-4">
            <div className="text-sm font-semibold text-muted mb-2">Описание:</div>
            <p className="text-sm text-muted leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-4">
            <div className="text-sm font-semibold text-muted mb-2">Оцените товар:</div>
            <StarInput value={userRating} onChange={setUserRating} />
          </div>

          <div className="bg-surface rounded-xl p-4 lg:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-muted">
                {canAdd ? (
                  <>
                    Количество:{' '}
                    <span className="text-[11px] font-normal text-dim">
                      (доступно {maxQuantity})
                    </span>
                  </>
                ) : (
                  <>Количество</>
                )}
              </div>
              <QuantityStepper
                quantity={quantity}
                onDecrement={decrement}
                onIncrement={increment}
                max={maxQuantity}
              />
            </div>

            <PrimaryButton onClick={handleAddToCart} disabled={!canAdd || maxQuantity === 0}>
              {!canAdd
                ? 'Выберите вариант'
                : `В корзину — ${formatPrice(product.price * quantity)}`}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProductDetail;
