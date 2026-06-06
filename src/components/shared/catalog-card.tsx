import React from 'react';
import type { ApiCategoryInfo } from '@/api/dto/category.dto';

interface CatalogCardProps {
  cat: ApiCategoryInfo;
  icon: React.ReactNode;
  index: number;
  onClick: () => void;
}

const CatalogCard: React.FC<CatalogCardProps> = ({ cat, icon, index, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 p-8 bg-surface rounded-xl cursor-pointer border-none transition-all duration-300 animate-[fadeInUp_0.4s_ease_forwards] opacity-0"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <span className="text-body">{icon}</span>
      <span className="text-sm font-semibold text-primary">{cat.label}</span>
      <span className="text-xs text-muted">{cat.productCount ?? 0} товаров</span>
    </button>
  );
};

export { CatalogCard };
