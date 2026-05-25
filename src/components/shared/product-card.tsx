import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useToastStore } from '../../store/useToastStore';
import { Heart } from 'lucide-react';
import { StarRating, Badge, PriceDisplay, PrimaryButton } from '../ui';
import clsx from 'clsx';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const addToast = useToastStore((s) => s.addToast);
  const wishlisted = isWishlisted(product.id);

  const handleWish = async () => {
    await toggleWishlist(product.id);
    addToast(
      wishlisted
        ? `${product.name} убран из избранного`
        : `${product.name} добавлен в избранное`
    );
    if (!wishlisted) {
      const btn = document.activeElement as HTMLElement;
      btn?.style.setProperty('transform', 'scale(1.3)');
      setTimeout(() => btn?.style.removeProperty('transform'), 200);
    }
  };

  return (
    <div
      className="bg-surface rounded-xl overflow-hidden transition-all duration-300 flex flex-col relative "
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <div className="relative w-full aspect-square bg-page overflow-hidden">
        {product.badge && <Badge type={product.badge} />}
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={product.image}
          alt={product.name}
          loading="lazy"
        />
        <button
          className={clsx(
            'absolute top-2 right-2 bg-surface/80 backdrop-blur-sm border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer z-2 transition-all duration-200 hover:scale-115 active:scale-90',
            wishlisted ? 'text-primary' : 'text-muted hover:text-primary'
          )}
          onClick={handleWish}
          aria-label={wishlisted ? 'Убрать из избранного' : 'Добавить в избранное'}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="text-sm font-semibold text-primary leading-tight line-clamp-2">{product.name}</div>
        <StarRating rating={product.rating} />
        <div className="mt-auto">
          <PriceDisplay price={product.price} oldPrice={product.oldPrice} />
        </div>
        <PrimaryButton size="sm" className="mt-1" onClick={() => navigate(`/product/${product.id}`)}>
          Подробнее
        </PrimaryButton>
      </div>
    </div>
  );
};

export { ProductCard };
