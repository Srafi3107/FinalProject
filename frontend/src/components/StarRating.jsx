import React from 'react';
import './StarRating.css';

const StarRating = ({
  rating = 0,
  maxStars = 5,
  size = 'md', // 'sm' | 'md' | 'lg'
  interactive = false,
  onChange = null,
  showValue = false
}) => {
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

  const handleClick = (starValue) => {
    if (interactive && onChange) {
      onChange(starValue);
    }
  };

  return (
    <div className={`star-rating-wrapper size-${size} ${interactive ? 'is-interactive' : ''}`}>
      <div className="stars-row">
        {stars.map((star) => {
          const isFilled = star <= Math.round(rating);
          const isPartial = star - 0.5 === rating;

          return (
            <button
              key={star}
              type="button"
              className={`star-icon-btn ${isFilled ? 'filled' : 'empty'} ${isPartial ? 'half-filled' : ''}`}
              onClick={() => handleClick(star)}
              disabled={!interactive}
              aria-label={`${star} of ${maxStars} stars`}
            >
              ★
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="rating-numeric-value">{Number(rating).toFixed(1)}</span>
      )}
    </div>
  );
};

export default StarRating;
