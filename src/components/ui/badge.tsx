import React from 'react';

interface BadgeProps {
  type: string;
}

const Badge: React.FC<BadgeProps> = ({ type }) => {
  return (
    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider whitespace-nowrap z-10 bg-primary text-on-primary">
      {type}
    </span>
  );
};

export { Badge };
