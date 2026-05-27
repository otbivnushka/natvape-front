import React from 'react';

interface StarRatingProps {
  rating: number;
  showValue?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, showValue = true }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <span key={i} className="text-[14px] leading-none text-primary">
          ★
        </span>,
      );
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      stars.push(
        <span key={i} className="relative text-[14px] leading-none text-muted">
          <span className="absolute left-0 top-0 w-1/2 overflow-hidden text-primary">★</span>★
        </span>,
      );
    } else {
      stars.push(
        <span key={i} className="text-[14px] leading-none text-muted">
          ★
        </span>,
      );
    }
  }

  return (
    <span className="inline-flex gap-0.5 items-center">
      {stars}
      {showValue && <span className="ml-1.5 text-[13px] text-muted font-medium">{rating}</span>}
    </span>
  );
};

export { StarRating };
