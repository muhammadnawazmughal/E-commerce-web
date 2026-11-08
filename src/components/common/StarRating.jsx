import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 5, totalStars = 5, size = 'sm', interactive = false, onRatingChange }) => {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: totalStars }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.round(rating);

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
            className={`${interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'} p-0.5`}
          >
            <Star
              className={`${sizeMap[size] || 'w-4 h-4'} ${
                isFilled
                  ? 'text-[#D4AF37] fill-[#D4AF37]'
                  : 'text-luxury-300 fill-luxury-100'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
