import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { LayoutPanelTop, ShoppingCart, Heart, User } from 'lucide-react';
import clsx from 'clsx';

const linkBase =
  'flex flex-col items-center gap-0.5 bg-transparent border-none cursor-pointer text-[11px] font-medium px-3 py-1 transition-all duration-200 no-underline relative';

interface NavLinkItemProps {
  to: string;
  end?: boolean;
  children: React.ReactNode;
}

const NavLinkItem: React.FC<NavLinkItemProps> = ({ to, end, children }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      clsx(linkBase, isActive ? 'text-body font-semibold scale-105' : 'text-dim hover:text-body')
    }
  >
    {children}
  </NavLink>
);

const BottomNav: React.FC = () => {
  const count = useCartStore((s) => s.totalItems());

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-line flex justify-around items-center z-100">
      <NavLinkItem to="/" end>
        <LayoutPanelTop size={18} />
        Каталог
      </NavLinkItem>
      <NavLinkItem to="/cart">
        <ShoppingCart size={18} />
        Корзина
        {count > 0 && (
          <span className="absolute -top-0.5 right-1 bg-primary text-on-primary text-[10px] font-bold rounded-full min-w-4 h-4 flex items-center justify-center px-1">
            {count}
          </span>
        )}
      </NavLinkItem>
      <NavLinkItem to="/wishlist">
        <Heart size={18} />
        Избранное
      </NavLinkItem>
      <NavLinkItem to="/profile">
        <User size={18} />
        Профиль
      </NavLinkItem>
    </nav>
  );
};

export { BottomNav };
