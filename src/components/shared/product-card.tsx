import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '@/types';
import { useWishlist, useToggleWishlist } from '@/hooks/queries/useWishlistQuery';
import { useToastStore } from '@/store/useToastStore';
import { Heart } from 'lucide-react';
import { StarRating, Badge, PriceDisplay, PrimaryButton } from '@/components/ui';
import clsx from 'clsx';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const navigate = useNavigate();
  const { data: products = [] } = useWishlist();
  const toggleMutation = useToggleWishlist();
  const addToast = useToastStore((s) => s.addToast);
  const wishlisted = products.some((p) => p.id === product.id);

  const handleWish = () => {
    toggleMutation.mutate({
      productId: product.id,
      action: wishlisted ? 'remove' : 'add',
    });
    addToast(
      wishlisted ? `${product.name} убран из избранного` : `${product.name} добавлен в избранное`,
    );
  };

  return (
    <div
      className="bg-surface rounded-xl overflow-hidden transition-all duration-300 flex flex-col relative "
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <div className="relative w-full aspect-square bg-page overflow-hidden">
        {product.badge && <Badge type={product.badge} />}
        <img
          className="w-full h-full object-cover transition-transform duration-500 cursor-pointer"
          src={product.image}
          alt={product.name}
          loading="lazy"
          onClick={() => navigate(`/product/${product.id}`)}
        />
        <HeartButton wishlisted={wishlisted} onClick={handleWish} />
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="text-sm font-semibold text-primary leading-tight line-clamp-2">
          {product.name}
        </div>
        <StarRating rating={product.rating} />
        <div className="mt-auto">
          <PriceDisplay price={product.price} doublePrice={product.doublePrice} />
        </div>
        <PrimaryButton
          size="sm"
          className="mt-1"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          Подробнее
        </PrimaryButton>
      </div>
    </div>
  );
};

interface HeartButtonProps {
  wishlisted: boolean;
  onClick: () => void;
}

const HeartButton: React.FC<HeartButtonProps> = ({ wishlisted, onClick }) => {
  return (
    <button
      className={clsx(
        'absolute top-2 right-2 bg-surface/80 backdrop-blur-sm border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer z-2 transition-all duration-200',
        wishlisted ? 'text-primary' : 'text-muted hover:text-primary',
      )}
      onClick={onClick}
      aria-label={wishlisted ? 'Убрать из избранного' : 'Добавить в избранное'}
    >
      <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
    </button>
  );
};

export { HeartButton };

export { ProductCard };
