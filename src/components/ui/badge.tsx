import React from 'react';

interface BadgeProps {
  type: 'NEW' | 'SALE';
}

const Badge: React.FC<BadgeProps> = ({ type }) => {
  return (
    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider z-10 bg-primary text-on-primary">
      {type}
    </span>
  );
};

export { Badge };
